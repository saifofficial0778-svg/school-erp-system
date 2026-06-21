// models/feeModel.js
const pool = require('../config/db');

const Fee = {
    // ... baki functions same rahenge

    // 🔴 Upgraded payment logic matching unique constraints
    recordPayment: async (schoolId, studentId, totalBill, amountPaid, paymentDate, paymentMode, status, transactionId) => {
        const query = `
            INSERT INTO fees 
            (school_id, student_id, total_bill_amount, amount_paid, payment_date, payment_mode, status, transaction_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            amount_paid = amount_paid + VALUES(amount_paid), -- 🔥 Ab naya calculated total purane wale par overwrite hoga, dynamic plus frontend handles
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

    // 🟢 CRASH-PROOF LIVE FETCH (Pehle se unique ho chuka h toh group by ki bhi load nahi)
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
    }
};

module.exports = Fee;