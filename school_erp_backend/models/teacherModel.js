const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const generatePassword = require('../utils/generatePassword');

const Teacher = {
    // List ke liye halke fields (jaise student ka fetchAllBaseProfiles)
    fetchAllBaseProfiles: async (schoolId) => {
        const [rows] = await pool.query(
            `SELECT id, full_name, phone, qualification, specialization, 
                    experience_years, joining_date, gender
             FROM teachers WHERE school_id = ?`,
            [schoolId]
        );
        return rows;
    },

    createTeacherTransaction: async (
        schoolId, email, fullName, phone, qualification, specialization,
        experienceYears, previousSchool, joiningDate, dateOfBirth, gender,
        address, bankName, accountNumber, ifscCode, accountHolderName,
        accountType, salary
    ) => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // ✅ Student jaisa hi - random password generate karo, login khud milega
            const plainPassword = generatePassword();
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            // A. users table me entry (role = 'teacher')
            const [userResult] = await connection.query(
                `INSERT INTO users (school_id, email, password, role) 
                 VALUES (?, ?, ?, 'teacher')`,
                [schoolId, email, hashedPassword]
            );
            const userId = userResult.insertId;

            // B. teachers table me poori profile
            const [teacherResult] = await connection.query(
                `INSERT INTO teachers 
                 (user_id, school_id, full_name, phone, qualification, specialization,
                  experience_years, previous_school, joining_date, date_of_birth, gender,
                  address, bank_name, account_number, ifsc_code, account_holder_name,
                  account_type, salary) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, schoolId, fullName, phone, qualification, specialization,
                    experienceYears, previousSchool, joiningDate, dateOfBirth, gender,
                    address, bankName, accountNumber, ifscCode, accountHolderName,
                    accountType, salary]
            );

            await connection.commit();

            return {
                id: teacherResult.insertId,
                fullName,
                qualification,
                credentials: {
                    email,
                    password: plainPassword  // frontend popup ke liye, ek hi baar milega
                }
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    updateTeacherTransaction: async (
        teacherId, email, fullName, phone, qualification, specialization,
        experienceYears, previousSchool, joiningDate, dateOfBirth, gender,
        address, bankName, accountNumber, ifscCode, accountHolderName,
        accountType, salary
    ) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [teacherRow] = await connection.query(
                `SELECT user_id FROM teachers WHERE id = ?`,
                [teacherId]
            );
            if (teacherRow.length === 0) {
                throw new AppError('Bhaya, is ID ka koi teacher hi nahi mila system me.', 404);
            }
            const userId = teacherRow[0].user_id;

            // Table A: users me email update
            await connection.query(
                `UPDATE users SET email = ? WHERE id = ?`,
                [email, userId]
            );

            // Table B: teachers me baaki saari profile details update
            const [result] = await connection.query(
                `UPDATE teachers 
                 SET full_name = ?, 
                     phone = ?, 
                     qualification = ?, 
                     specialization = ?, 
                     experience_years = ?, 
                     previous_school = ?, 
                     joining_date = ?, 
                     date_of_birth = ?, 
                     gender = ?, 
                     address = ?, 
                     bank_name = ?, 
                     account_number = ?, 
                     ifsc_code = ?, 
                     account_holder_name = ?, 
                     account_type = ?, 
                     salary = ? 
                 WHERE id = ?`,
                [fullName, phone, qualification, specialization, experienceYears,
                    previousSchool, joiningDate, dateOfBirth, gender, address,
                    bankName, accountNumber, ifscCode, accountHolderName,
                    accountType, salary, teacherId]
            );

            await connection.commit();
            return {
                success: true,
                message: "Teacher profile aur Email dono chaka-chak update ho gaye boss!",
                affectedRows: result.affectedRows
            };
        } catch (error) {
            await connection.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError(`Database Error: ${error.message}`, 500);
        } finally {
            connection.release();
        }
    },

    deleteTeacherTransaction: async (schoolId, teacherId) => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [teacherRow] = await connection.query(
                `SELECT user_id FROM teachers WHERE id = ? AND school_id = ?`,
                [teacherId, schoolId]
            );

            if (teacherRow.length === 0) {
                throw new AppError('Bhaya, is ID ka koi teacher tumhare school me nahi mila.', 404);
            }

            const userId = teacherRow[0].user_id;

            await connection.query(
                `DELETE FROM teachers WHERE id = ? AND school_id = ?`,
                [teacherId, schoolId]
            );

            await connection.query(
                `DELETE FROM users WHERE id = ? AND school_id = ?`,
                [userId, schoolId]
            );

            await connection.commit();
            return {
                success: true,
                message: "Teacher aur uski login ID dono system se permanent tabah! 🔥"
            };
        } catch (error) {
            await connection.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError(`Database Error: ${error.message}`, 500);
        } finally {
            connection.release();
        }
    },

    getTeacherById: async (schoolId, teacherId) => {
        const [rows] = await pool.query(
            `SELECT t.*, u.email 
             FROM teachers t
             JOIN users u ON t.user_id = u.id
             WHERE t.id = ? AND t.school_id = ?`,
            [teacherId, schoolId]
        );
        return rows[0];
    },

    // Complete profile - agar aage chalke teacher ke assigned classes,
    // attendance ya salary logs bhi dikhane ho to yaha joins add kar dena
    // (student ke getStudentCompleteProfile jaisa hi pattern)
    getTeacherCompleteProfile: async (schoolId, teacherId) => {
        const [profileRows] = await pool.query(
            `SELECT t.*, u.email 
             FROM teachers t
             JOIN users u ON t.user_id = u.id
             WHERE t.id = ? AND t.school_id = ?`,
            [teacherId, schoolId]
        );

        if (profileRows.length === 0) return null;

        // NOTE: Jab class module ban jayega, yaha teacher ke assigned
        // classes fetch karne wali query add kar dena, jaise:
        // SELECT c.id, c.class_name, c.section FROM classes c
        // WHERE c.teacher_id = ? AND c.school_id = ?

        return {
            profile: profileRows[0]
        };
    },
    getTeacherIdByUserId: async (userId, schoolId) => {
    const [rows] = await pool.query(
        `SELECT id FROM teachers WHERE user_id = ? AND school_id = ?`,
        [userId, schoolId]
    );
    return rows[0]?.id || null;
}
};

module.exports = Teacher;