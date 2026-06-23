const pool = require('../config/db');
const bcrypt = require('bcrypt');

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
    }
};

module.exports = Student;