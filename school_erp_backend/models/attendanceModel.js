// school_erp_backend/models/attendanceModel.js
const pool = require('../config/db');

const Attendance = {
    // 🎯 A. Query to fetch records matching date and school_id (Purana code - UNTOUCHED)
    fetchByDate: async (schoolId, date) => {
        let query = `SELECT * FROM attendance WHERE school_id = ?`;
        let params = [schoolId];

        if (date) {
            query += ` AND date = ?`;
            params.push(date);
        }

        const [rows] = await pool.query(query, params);
        return rows;
    },

    // 🎯 B. Query to safely insert single attendance log (Purana code - UNTOUCHED)
    markSingle: async (schoolId, studentId, date, status, remarks) => {
        const query = `
            INSERT INTO attendance (school_id, student_id, date, status, remarks) 
            VALUES (?, ?, ?, ?, ?);
        `;
        const [result] = await pool.query(query, [schoolId, studentId, date, status, remarks]);
        return { id: result.insertId, schoolId, studentId, date, status, remarks };
    },

    // 🚀 NEW ADDITION: For Attendance % Pie Chart Analytics (UNTOUCHED)
    fetchAnalyticsForPie: async (schoolId) => {
        const query = `
            SELECT 
                status, 
                COUNT(*) AS count,
                ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM attendance WHERE school_id = ?)), 2) AS percentage
            FROM attendance
            WHERE school_id = ?
            GROUP BY status;
        `;
        const [rows] = await pool.query(query, [schoolId, schoolId]);
        return rows;
    },

    // 🟢 FIXED ADDITION: fetchMonthlyReport ko isi single object ke andar lapet diya!
    fetchMonthlyReport: async (schoolId) => {
        const query = `
            SELECT 
                s.id AS student_id,
                s.full_name AS student_name,
                s.admission_number AS admission_no,
                a.id AS attendance_id,
                a.status AS log_status
            FROM students s
            LEFT JOIN attendance a ON s.id = a.student_id
            WHERE s.school_id = ?;
        `;
        const [rows] = await pool.query(query, [schoolId]);
        return rows;
    }
};

// ✅ Ab niche module.exports bilkul sahi h, pure object ko single export de diya!
module.exports = Attendance;