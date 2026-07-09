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

        // Check if student already has a record for this academic year
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

        // Update fee summary
        await pool.query(
            `UPDATE fee_summary fs
         JOIN classes c ON c.id = ?
         SET fs.total_fee = c.monthly_fee
         WHERE fs.student_id = ?
         AND fs.school_id = ?`,
            [classId, studentId, schoolId]
        );
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