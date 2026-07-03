const pool = require('../config/db');
// studentModel.js line 2
const bcrypt = require('bcryptjs');  // ✅ 'bcryptjs' - jo package.json mein hai
const AppError = require('../utils/AppError');

// Random strong password generator
const generatePassword = () => {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghjkmnpqrstuvwxyz';
    const digits = '23456789';
    const special = '@#$!';

    const rand = (str) => str[Math.floor(Math.random() * str.length)];

    // Ensure at least one of each type
    const base = rand(upper) + rand(lower) + rand(digits) + rand(special);
    const extra = Array.from({ length: 6 }, () =>
        rand(upper + lower + digits)
    ).join('');

    // Shuffle
    return (base + extra).split('').sort(() => Math.random() - 0.5).join('');
};

const Student = {
    fetchAllBaseProfiles: async (schoolId) => {
        const [rows] = await pool.query(
            `SELECT id, full_name, admission_number, roll_number, gender, guardian_name 
             FROM students WHERE school_id = ?`,
            [schoolId]
        );
        return rows;
    },

    createStudentTransaction: async (
        schoolId, email, fullName, admissionNumber,
        rollNumber, whatsAppNumber, dateOfBirth, gender, guardianName
    ) => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // ✅ Generate password here
            const plainPassword = generatePassword();
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            // A. Insert into users (password col, not password_hash)
            const [userResult] = await connection.query(
                `INSERT INTO users (school_id, email, password, role) 
                 VALUES (?, ?, ?, 'student')`,
                [schoolId, email, hashedPassword]
            );
            const userId = userResult.insertId;

            // B. Insert into students
            const [studentResult] = await connection.query(
                `INSERT INTO students 
                 (user_id, school_id, full_name, admission_number, roll_number, 
                  whats_app_number, date_of_birth, gender, guardian_name) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, schoolId, fullName, admissionNumber, rollNumber,
                    whatsAppNumber, dateOfBirth, gender, guardianName]
            );

            await connection.commit();

            // ✅ Plain password return karo (sirf ek baar dikhega)
            return {
                id: studentResult.insertId,
                fullName,
                rollNumber,
                credentials: {
                    email,
                    password: plainPassword  // frontend ko bhejo popup ke liye
                }
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },


    updateStudentTransaction: async (studentId, email, fullName, rollNumber, whatsAppNumber, dateOfBirth, gender, guardianName) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [studentRow] = await connection.query(
                `SELECT user_id FROM students WHERE id=?`,
                [studentId]
            );
            if (studentRow.length === 0) {
                throw new AppError('Bhaya, is ID ka koi student hi nahi mila system me.', 404)
            }
            const userId = studentRow[0].user_id

            // 2. Table A: 'users' table me email update karo
            await connection.query(
                `UPDATE users SET email = ? WHERE id = ?`,
                [email, userId]
            );
            // 3. Table B: 'students' table me baaki saari profile details update karo
            const [result] = await connection.query(
                `UPDATE students 
                 SET full_name = ?, 
                     roll_number = ?, 
                     whats_app_number = ?, 
                     date_of_birth = ?, 
                     gender = ?, 
                     guardian_name = ? 
                 WHERE id = ?`,
                [fullName, rollNumber, whatsAppNumber, dateOfBirth, gender, guardianName, studentId]
            );
            await connection.commit();
            return {
                success: true,
                message: "Profile aur Email dono chaka-chak update ho gaye boss!",
                affectedRows: result.affectedRows
            };
        } catch (error) {
            await connection.rollback()

            throw new AppError(`Database Error: ${error.message}`, 500);
        } finally {
            connection.release()
        }
    },

    deleteStudentTransaction: async (schoolId, studentId) => {
        const connection = await pool.getConnection()

        try {
            await connection.beginTransaction()

            const [studentRow] = await connection.query(
                `SELECT user_id FROM students WHERE id = ? AND school_id = ?`,
                [studentId, schoolId]
            );

            if (studentRow.length === 0) {
                throw new AppError('Bhaya, is ID ka koi student tumhare school me nahi mila.', 404)
            }

            const userId = studentRow[0].user_id

            await connection.query(
                `DELETE FROM students WHERE id = ? AND school_id = ?`,
                [studentId, schoolId]
            )

            await connection.query(
                `DELETE FROM users WHERE id = ? AND school_id = ?`,
                [userId, schoolId]
            );
            await connection.commit()
            return {
                success: true,
                message: "Student aur uski login ID dono system se permanent tabah! 🔥"
            }
        } catch (error) {
            await connection.rollback()

            // Agar error pehle se hi AppError hai (jaise 404 wala), toh use waise hi throw karo
            if (error instanceof AppError) throw error;

            // Nahi toh normal database error ko AppError bana kar bhejo
            throw new AppError(`Database Error: ${error.message}`, 500);
        } finally {
            connection.release()
        }
    },

    // studentModel.js ke Student object ke andar check karo:
    getStudentById: async (schoolId, studentId) => {
        const [rows] = await pool.query(
            `SELECT s.*, u.email 
         FROM students s
         JOIN users u ON s.user_id = u.id
         WHERE s.id = ? AND s.school_id = ?`,
            [studentId, schoolId]
        );
        return rows[0];
    },

   getStudentCompleteProfile: async (schoolId, studentId) => {
    // 1. Fetch Student Base Profile & User Email
    const [profileRows] = await pool.query(
        `SELECT s.*, u.email 
         FROM students s
         JOIN users u ON s.user_id = u.id
         WHERE s.id = ? AND s.school_id = ?`,
        [studentId, schoolId]
    );

    if (profileRows.length === 0) return null;

    // 2. Fetch Fee Summary (Exact Column Names matching your image)
    const [feeRows] = await pool.query(
        `SELECT id, total_bill_amount, amount_paid, payment_date, payment_mode, status, transaction_id
         FROM fees 
         WHERE student_id = ? AND school_id = ? 
         ORDER BY id DESC`, // Month/Year nahi hai isliye ID desc se latest fees upar aayegi
        [studentId, schoolId]
    );

    // 3. Fetch Attendance Log (Pichle 30 records)
    const [attendanceRows] = await pool.query(
        `SELECT date, status, remarks 
         FROM attendance 
         WHERE student_id = ? AND school_id = ? 
         ORDER BY date DESC LIMIT 30`,
        [studentId, schoolId]
    );

    return {
        profile: profileRows[0],
        fees: feeRows,
        attendance: attendanceRows
    };
}
};

module.exports = Student;