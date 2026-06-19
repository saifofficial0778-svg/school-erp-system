const pool = require('../config/db');

const Student = {
    // 🎯 Live Dashboard & Registry counter ke liye pure profiles fetch
    fetchAllBaseProfiles: async (schoolId) => {
        const query = `
            SELECT id, full_name, admission_number, roll_number, gender, guardian_name 
            FROM students 
            WHERE school_id = ?;
        `;
        const [rows] = await pool.query(query, [schoolId]);
        return rows;
    },

    // 🎯 Master profile registration core data architecture
    createStudentTransaction: async (schoolId, email, passwordHash, fullName, admissionNumber, rollNumber, whatsAppNumber, dateOfBirth, gender, guardianName) => {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();

            // A. Identity User Insert
            const [userResult] = await connection.query(
                "INSERT INTO users (school_id, email, password_hash, role) VALUES (?, ?, ?, 'student')",
                [schoolId, email, passwordHash]
            );
            const userId = userResult.insertId;

            // B. Core Profile Details Insert (Exact matching schema positional sequence)
            const [studentResult] = await connection.query(
                `INSERT INTO students 
                (user_id, school_id, full_name, admission_number, roll_number, whats_app_number, date_of_birth, gender, guardian_name) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, schoolId, fullName, admissionNumber, rollNumber, whatsAppNumber, dateOfBirth, gender, guardianName]
            );
            const studentId = studentResult.insertId;

            await connection.commit();
            return { id: studentId, fullName, rollNumber, gender };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = Student;