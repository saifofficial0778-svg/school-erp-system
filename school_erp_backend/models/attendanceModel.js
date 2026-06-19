// school_erp_backend/models/attendanceModel.js
const pool = require('../config/db');

const Attendance = {
    // 🎯 A. Query to fetch records matching date and school_id
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

    // 🎯 B. Query to safely insert single attendance log using Prepared Statement
    markSingle: async (schoolId, studentId, date, status, remarks) => {
        const query = `
            INSERT INTO attendance (school_id, student_id, date, status, remarks) 
            VALUES (?, ?, ?, ?, ?);
        `;
        const [result] = await pool.query(query, [schoolId, studentId, date, status, remarks]);
        return { id: result.insertId, schoolId, studentId, date, status, remarks };
    }
};

module.exports = Attendance;