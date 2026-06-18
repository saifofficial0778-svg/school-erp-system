const pool = require('../config/db');

const Student = {
    // 🎯 A. GET ALL PROFILES: Ab bina class ke saare bache fetch honge (LEFT JOIN ya Simple Select)
    fetchAllBaseProfiles: async (schoolId) => {
        const query = `
            SELECT id, full_name, roll_number, guardian_name 
            FROM students 
            WHERE school_id = ?;
        `;
        const [rows] = await pool.query(query, [schoolId]);
        return rows;
    },

    // 🎯 B. CREATE TRANSACTION: Ab sirf user aur student profile banegi (No Class Map ❌)
    createStudentTransaction: async (schoolId, email, passwordHash, fullName, rollNumber, guardianName) => {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();

            // Step 1: Users table entry
            const [userResult] = await connection.query(
                "INSERT INTO users (school_id, email, password_hash, role) VALUES (?, ?, ?, 'student')",
                [schoolId, email, passwordHash]
            );
            const userId = userResult.insertId;

            // Step 2: Students profile entry
            const [studentResult] = await connection.query(
                "INSERT INTO students (user_id, school_id, full_name, roll_number, guardian_name) VALUES (?, ?, ?, ?, ?)",
                [userId, schoolId, fullName, rollNumber, guardianName]
            );
            const studentId = studentResult.insertId;

            // ❌ Step 3 (student_class_mapping) ko permanently yahan se hata diya!

            await connection.commit();
            return { id: studentId, fullName, rollNumber, guardianName };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = Student;