// models/feeModel.js
const pool = require('../config/db');

const Fee = {
    // 🟢 1. CRASH-PROOF LIVE JOIN QUERY (Strict Mode Safe - No Group By!)
    fetchAllWithStudents: async (schoolId) => {
        const query = `
            SELECT 
                s.id AS student_id,
                s.full_name AS full_name,
                s.admission_number AS admission_number,
                IFNULL(f.total_bill_amount, 12000.00) AS total_bill_amount,
                IFNULL(f.amount_paid, 0.00) AS amount_paid,
                IFNULL(f.status, 'pending') AS status
            FROM students s
            LEFT JOIN fees f ON s.id = f.student_id AND s.school_id = f.school_id
            WHERE s.school_id = ?;
        `;
        const [rows] = await pool.query(query, [schoolId]);
        return rows;
    },

    // 🔴 2. RECORD OR UPDATE PAYMENT
    recordPayment: async (schoolId, studentId, totalBill, amountPaid, paymentDate, paymentMode, status, transactionId) => {
        const query = `
            INSERT INTO fees 
            (school_id, student_id, total_bill_amount, amount_paid, payment_date, payment_mode, status, transaction_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            amount_paid = amount_paid + VALUES(amount_paid),
            status = VALUES(status),
            payment_date = VALUES(payment_date),
            payment_mode = VALUES(payment_mode),
            transaction_id = VALUES(transaction_id);
        `;
        const [result] = await pool.query(query, [
            schoolId, studentId, totalBill, amountPaid, paymentDate, paymentMode, status, transactionId
        ]);
        return result;
    },

    // 🔵 3. FETCH SINGLE STUDENT HISTORY
    fetchByStudent: async (schoolId, studentId) => {
        const query = `SELECT * FROM fees WHERE school_id = ? AND student_id = ? ORDER BY payment_date DESC`;
        const [rows] = await pool.query(query, [schoolId, studentId]);
        return rows;
    },

    // 📊 4. ANALYTICS PIE DATA
    fetchFeeStatusPieData: async (schoolId) => {
        const query = `
            SELECT 
                status, 
                COUNT(*) AS count,
                SUM(amount_paid) AS total_amount_in_this_status
            FROM fees
            WHERE school_id = ?
            GROUP BY status;
        `;
        const [rows] = await pool.query(query, [schoolId]);
        return rows;
    }
};

module.exports = Fee;