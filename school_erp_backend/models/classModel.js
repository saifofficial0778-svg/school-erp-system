const pool = require('../config/db');

const ClassModel = {
    // 1. Create Class
    createClass: async (schoolId, className, section, teacherId, monthlyFee) => {
        const [result] = await pool.query(
            `INSERT INTO classes (school_id, class_name, section, teacher_id, monthly_fee) 
             VALUES (?, ?, ?, ?, ?)`,
            [schoolId, className, section, teacherId || null, monthlyFee || 0]
        );
        return result.insertId;
    },

    // 2. Fetch All Classes with Teacher Name
    getAllClasses: async (schoolId) => {
        const [rows] = await pool.query(
            `SELECT c.*, t.full_name AS teacher_name,
                    (SELECT COUNT(*) FROM student_class_mapping scm WHERE scm.class_id = c.id AND scm.status = 'active') AS total_students
             FROM classes c
             LEFT JOIN teachers t ON c.teacher_id = t.id
             WHERE c.school_id = ?`,
            [schoolId]
        );
        return rows;
    },

    // 3. Assign Student to Class (Student Mapping)
   assignStudentToClass: async (schoolId, studentId, classId, academicYear = '2026-2027') => {
    // ... (student_class_mapping wala existing code same rahega) ...

    // 🔧 FIX: fee_summary row exist karti hai ya nahi, pehle check karo
    const [feeRow] = await pool.query(
        `SELECT id FROM fee_summary WHERE student_id = ? AND school_id = ?`,
        [studentId, schoolId]
    );

    // Class ki monthly_fee nikalo
    const [classRow] = await pool.query(
        `SELECT monthly_fee FROM classes WHERE id = ?`,
        [classId]
    );
    const monthlyFee = classRow[0]?.monthly_fee || 0;

    if (feeRow.length > 0) {
        // Row exist karti hai -> UPDATE
        await pool.query(
            `UPDATE fee_summary SET total_fee = ? WHERE student_id = ? AND school_id = ?`,
            [monthlyFee, studentId, schoolId]
        );
    } else {
        // Row exist nahi karti -> INSERT (jo pehle kabhi bani hi nahi thi)
        await pool.query(
            `INSERT INTO fee_summary (school_id, student_id, total_fee, total_paid, status)
             VALUES (?, ?, ?, 0.00, 'pending')`,
            [schoolId, studentId, monthlyFee]
        );
    }
},
    // 4. Fetch Students in a Class
    getStudentsByClass: async (classId, schoolId) => {
        const [rows] = await pool.query(
            `SELECT s.id, s.full_name, s.admission_number, s.roll_number, s.gender, scm.academic_year
             FROM student_class_mapping scm
             JOIN students s ON scm.student_id = s.id
             WHERE scm.class_id = ? AND scm.school_id = ? AND scm.status = 'active'`,
            [classId, schoolId]
        );
        return rows;
    }
};

module.exports = ClassModel;