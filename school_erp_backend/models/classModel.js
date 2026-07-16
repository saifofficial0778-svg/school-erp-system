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

    // ✅ Part 1: student_class_mapping me insert/update (ASLI CODE WAPAS DAALA)
    const [existing] = await pool.query(
        `SELECT id
         FROM student_class_mapping
         WHERE student_id = ?
         AND school_id = ?
         AND academic_year = ?`,
        [studentId, schoolId, academicYear]
    );

    if (existing.length > 0) {
        // Same academic year -> UPDATE
        await pool.query(
            `UPDATE student_class_mapping
             SET class_id = ?, status = 'active'
             WHERE id = ?`,
            [classId, existing[0].id]
        );
    } else {
        // New academic year -> INSERT
        await pool.query(
            `INSERT INTO student_class_mapping
             (school_id, student_id, class_id, academic_year, status)
             VALUES (?, ?, ?, ?, 'active')`,
            [schoolId, studentId, classId, academicYear]
        );
    }

    // ✅ Part 2: fee_summary check-then-insert-or-update (ye tumhara sahi hai, waisa hi rehne do)
    const [feeRow] = await pool.query(
        `SELECT id FROM fee_summary WHERE student_id = ? AND school_id = ?`,
        [studentId, schoolId]
    );

    const [classRow] = await pool.query(
        `SELECT monthly_fee FROM classes WHERE id = ?`,
        [classId]
    );
    const monthlyFee = classRow[0]?.monthly_fee || 0;
if (feeRow.length > 0) {
    // ✅ FIX: total_fee ke saath status bhi recalculate karo
    await pool.query(
        `UPDATE fee_summary 
         SET total_fee = ?,
             status = CASE 
                WHEN total_paid >= ? THEN 'paid'
                WHEN total_paid > 0 THEN 'partial'
                ELSE 'pending'
             END
         WHERE student_id = ? AND school_id = ?`,
        [monthlyFee, monthlyFee, studentId, schoolId]
    );
} else {
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
    },

    // Class ka poora record uthao (teacher_id samet) — ownership check ke liye
getClassById: async (classId, schoolId) => {
    const [rows] = await pool.query(
        `SELECT * FROM classes WHERE id = ? AND school_id = ?`,
        [classId, schoolId]
    );
    return rows[0] || null;
},

// Student abhi kis class me hai (active mapping) — attendance ownership check ke liye
getStudentActiveClass: async (studentId, schoolId) => {
    const [rows] = await pool.query(
        `SELECT c.id, c.teacher_id 
         FROM student_class_mapping scm
         JOIN classes c ON scm.class_id = c.id
         WHERE scm.student_id = ? AND scm.school_id = ? AND scm.status = 'active'`,
        [studentId, schoolId]
    );
    return rows[0] || null;
}
};

module.exports = ClassModel;