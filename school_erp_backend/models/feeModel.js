const pool = require('../config/db');

const Fee = {

    // =============================================
    // 1. STUDENT ENROLL HOTE TIME - fee_summary row banao
    // StudentModel ke createStudentTransaction ke baad call karo
    // =============================================
    initializeFeeSummary: async (connection, schoolId, studentId, totalFee) => {
        await connection.query(
            `INSERT INTO fee_summary (school_id, student_id, total_fee, total_paid, status)
             VALUES (?, ?, ?, 0.00, 'pending')`,
            [schoolId, studentId, totalFee]
        );
    },

    // =============================================
    // 2. PAYMENT RECORD KARO - dono tables update hogi
    // fee_logs mein naya row + fee_summary mein total_paid update
    // =============================================
    recordPayment: async (schoolId, studentId, amountPaid, paymentMode, transactionId, remarks) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const paymentDate = new Date().toISOString().split('T')[0];

        // Step 1: fee_logs mein naya payment log INSERT karo (same as before)
        await connection.query(
            `INSERT INTO fee_logs 
             (school_id, student_id, amount_paid, payment_date, payment_mode, transaction_id, remarks)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [schoolId, studentId, amountPaid, paymentDate, paymentMode,
                transactionId || `TXN_${Date.now()}`, remarks || null]
        );

        // Step 2: ✅ FIX — pehle current total_paid/total_fee row-lock karke fetch karo
        const [rows] = await connection.query(
            `SELECT total_paid, total_fee FROM fee_summary 
             WHERE student_id = ? AND school_id = ? FOR UPDATE`,
            [studentId, schoolId]
        );

        if (rows.length === 0) {
            throw new Error('Fee summary record nahi mila is student ka.');
        }

        // Step 3: ✅ JS me hi purani value se naya total calculate karo (double-add nahi hoga)
        const currentPaid = parseFloat(rows[0].total_paid);
        const totalFee = parseFloat(rows[0].total_fee);
        const newTotalPaid = currentPaid + amountPaid;

        const newStatus = newTotalPaid >= totalFee
            ? 'paid'
            : (newTotalPaid > 0 ? 'partial' : 'pending');

        // Step 4: ek hi baar clean UPDATE — koi double-reference nahi
        await connection.query(
            `UPDATE fee_summary 
             SET total_paid = ?, last_payment_date = ?, last_payment_mode = ?, status = ?
             WHERE student_id = ? AND school_id = ?`,
            [newTotalPaid, paymentDate, paymentMode, newStatus, studentId, schoolId]
        );

        await connection.commit();
        return { success: true };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
},

    // =============================================
    // 3. FEE MANAGEMENT PAGE - sabhi students ki summary
    // =============================================
    fetchAllWithStudents: async (schoolId) => {
        const [rows] = await pool.query(
            `SELECT 
                s.id AS student_id,
                s.full_name,
                s.admission_number,
                IFNULL(fs.total_fee, 0.00) AS total_fee,
                IFNULL(fs.total_paid, 0.00) AS total_paid,
                IFNULL(fs.total_due, 0.00) AS total_due,
                IFNULL(fs.status, 'pending') AS status,
                fs.last_payment_date,
                fs.last_payment_mode
             FROM students s
             LEFT JOIN fee_summary fs ON s.id = fs.student_id AND s.school_id = fs.school_id
             WHERE s.school_id = ?`,
            [schoolId]
        );
        return rows;
    },

    // =============================================
    // 4. STUDENT VIEW PAGE - ek student ki summary + history
    // =============================================
    fetchStudentFeeDetails: async (schoolId, studentId) => {
        // Summary (latest snapshot)
        const [summaryRows] = await pool.query(
            `SELECT total_fee, total_paid, total_due, status, last_payment_date, last_payment_mode
             FROM fee_summary
             WHERE student_id = ? AND school_id = ?`,
            [studentId, schoolId]
        );

        // Payment history (sabhi logs)
        const [logRows] = await pool.query(
            `SELECT id, amount_paid, payment_date, payment_mode, transaction_id, remarks, created_at
             FROM fee_logs
             WHERE student_id = ? AND school_id = ?
             ORDER BY payment_date DESC`,
            [studentId, schoolId]
        );

        return {
            summary: summaryRows[0] || null,
            logs: logRows
        };
    },

    // =============================================
    // 5. FEE REPORT PAGE
    // =============================================
    fetchFeeReports: async (schoolId) => {
    const [rows] = await pool.query(
        `SELECT 
            s.id AS student_id,
            s.full_name,
            s.admission_number,
            c.class_name,
            c.section,
            IFNULL(fs.total_fee, 0.00) AS total_fee,
            IFNULL(fs.total_paid, 0.00) AS total_paid,
            IFNULL(fs.total_due, 0.00) AS total_due,
            IFNULL(fs.status, 'pending') AS status,
            fs.last_payment_date
         FROM students s
         LEFT JOIN student_class_mapping scm ON s.id = scm.student_id AND scm.status = 'active'
         LEFT JOIN classes c ON scm.class_id = c.id
         LEFT JOIN fee_summary fs ON s.id = fs.student_id AND s.school_id = fs.school_id
         WHERE s.school_id = ?`,
        [schoolId]
    );
    return rows;
},
    // =============================================
    // 6. DASHBOARD PIE CHART DATA
    // =============================================
    fetchFeeStatusPieData: async (schoolId) => {
        const [rows] = await pool.query(
            `SELECT 
                status,
                COUNT(*) AS count,
                SUM(total_fee) AS total_amount
             FROM fee_summary
             WHERE school_id = ?
             GROUP BY status`,
            [schoolId]
        );
        return rows;
    }
};

module.exports = Fee;