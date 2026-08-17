const pool = require("../../../config/db");

const StudentFeeModel = {

    async createStudentFee(schoolId, studentFeeData) {
        const { studentId, feeStructureId } = studentFeeData

        const [result] = await pool.execute(
            `
            INSERT INTO student_fees(
            school_id,
            student_id,
            fee_structure_id
            )
            VALUES (?, ?, ?)
            `, [schoolId, studentId, feeStructureId]
        )
        return result.insertId
    },

    async getAllStudentFees(schoolId) {
        const [result] = await pool.execute(
            `
        SELECT
            sf.id AS student_fee_id,
            sf.student_id,
            sf.fee_structure_id,
            ft.name AS fee_type,
            fs.amount,
            fs.frequency,
            sf.status
        FROM student_fees sf
        JOIN fee_structures fs
            ON sf.fee_structure_id = fs.id
        JOIN fee_types ft
            ON fs.fee_type_id = ft.id
        WHERE sf.school_id = ?
        AND sf.is_deleted = FALSE
        AND fs.is_deleted=FALSE
        AND ft.is_deleted=FALSE
        `,
            [schoolId]
        );

        return result;
    },

    async getStudentFeeById(id, schoolId) {
        const [result] = await pool.execute(
            `
        SELECT
            sf.id AS student_fee_id,
            sf.student_id,
            sf.fee_structure_id,
            ft.name AS fee_type,
            fs.amount,
            fs.frequency,
            sf.status
        FROM student_fees sf
        JOIN fee_structures fs
            ON sf.fee_structure_id = fs.id
        JOIN fee_types ft
            ON fs.fee_type_id = ft.id
        WHERE sf.school_id = ?
        AND sf.id=?
        AND sf.is_deleted = FALSE
        AND fs.is_deleted=FALSE
        AND ft.is_deleted=FALSE
        `,
            [schoolId, id]
        );

        return result[0];
    },

    async getStudentFeesByStudentId(studentId, schoolId) {
        const [result] = await pool.execute(
            `
        SELECT
            sf.id AS student_fee_id,
            sf.student_id,
            sf.fee_structure_id,
            ft.name AS fee_type,
            fs.amount,
            fs.frequency,
            sf.status
        FROM student_fees sf
        JOIN fee_structures fs
            ON sf.fee_structure_id = fs.id
        JOIN fee_types ft
            ON fs.fee_type_id = ft.id
        WHERE sf.school_id = ?
        AND sf.student_id=?
        AND sf.is_deleted = FALSE
        AND fs.is_deleted=FALSE
        AND ft.is_deleted=FALSE
        `,
            [schoolId, studentId]
        );

        return result;
    },

    async updateStatus(id, schoolId, status) {
        const [result] = await pool.execute(
            `
        UPDATE student_fees
        SET
            status=?
        WHERE
            id=?
            AND school_id=?
            AND is_deleted=FALSE
        `,
            [status, id, schoolId]
        );

        return result.affectedRows;
    },

    async deleteStudentFee(id, schoolId) {
        const [result] = await pool.execute(
            `
        UPDATE student_fees
        SET
            is_deleted=TRUE
        WHERE
            id=?
            AND school_id=?
            AND is_deleted=FALSE
        `,
            [id, schoolId]
        );

        return result.affectedRows;
    },

    async findStudentFee(studentId, feeStructureId, schoolId) {
        const [result]=await pool.execute(
            `
            SELECT id 
            FROM student_fees
            WHERE student_id=?
                AND fee_structure_id=?
                AND school_id=?
                AND is_deleted=FALSE
                
            `,[studentId,feeStructureId,schoolId]
        )
        return result[0]
    },
    async getStudentFeeTotal(studentId, schoolId) {
        const [result] = await pool.execute(
            `
        SELECT
            SUM(fs.amount) AS total_amount
        FROM student_fees sf
        INNER JOIN fee_structures fs
            ON sf.fee_structure_id = fs.id
        WHERE
            sf.student_id = ?
            AND sf.school_id = ?
            AND sf.is_deleted = FALSE
            AND fs.is_deleted = FALSE
            AND fs.is_active = TRUE
        `,
            [studentId, schoolId]
        );

        return result[0];
    }

};

module.exports = StudentFeeModel;