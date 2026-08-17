const pool = require("../../../config/db");

const StudentFeeAccountModel = {

    async createStudentFeeAccount(schoolId, feeAccountData) {
        const { studentId, academicYearId, totalAmount, status } = feeAccountData

        const [result] = await pool.execute(
            `
        INSERT INTO student_fee_accounts (
            school_id,
            student_id,
            academic_year_id,
            total_amount,
            status
        )
        VALUES (?, ?, ?, ?, ?)
        `,
            [
                schoolId,
                studentId,
                academicYearId,
                totalAmount,
                status
            ]
        );

        return result.insertId;

    },

    async getAllStudentFeeAccounts(schoolId) {
        const [result] = await pool.execute(
            `
        SELECT
            id,
            student_id,
            academic_year_id,
            total_amount,
            status
        FROM student_fee_accounts
        WHERE
            school_id = ?
            AND is_deleted = FALSE
        `,
            [schoolId]
        );

        return result;
    },

    async getStudentFeeAccountById(id, schoolId) {
        const [result] = await pool.execute(
            `
        SELECT
            id,
            student_id,
            academic_year_id,
            total_amount,
            status
        FROM student_fee_accounts
        WHERE
            id=?
            AND school_id = ?
            AND is_deleted = FALSE
        `,
            [id, schoolId]
        );

        return result[0];
    },

    async getStudentFeeAccountByStudentId(studentId, schoolId) {
        const [result] = await pool.execute(
            `
        SELECT
            id,
            student_id,
            academic_year_id,
            total_amount,
            status
        FROM student_fee_accounts
        WHERE
            student_id=?
            AND school_id = ?
            AND is_deleted = FALSE
        `,
            [studentId, schoolId]
        );

        return result;
    },

    async updateStatus(id, schoolId, status) {
        const [result] = await pool.execute(
            `
        UPDATE student_fee_accounts
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
    async deleteStudentFeeAccount(id, schoolId) {
        const [result] = await pool.execute(
            `
        UPDATE student_fee_accounts
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

    async findStudentFeeAccount(studentId, academicYearId, schoolId) {
        const [result] = await pool.execute(
            `
        SELECT
            id,
            total_amount,
            status
        FROM student_fee_accounts
        WHERE
            student_id=?
            AND school_id = ?
            AND academic_year_id=?
            AND is_deleted = FALSE
        `,
            [studentId, schoolId, academicYearId]
        );

        return result[0];
    },

    

};

module.exports = StudentFeeAccountModel;