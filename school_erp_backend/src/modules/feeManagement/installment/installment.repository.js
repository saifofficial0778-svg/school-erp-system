const pool = require("../../../config/db");

const InstallmentModel = {


    async getAllInstallments(schoolId) {
        const [result] = await pool.execute(
            `
            SELECT
                id,
                student_fee_account_id,
                installment_no,
                amount,
                due_date,
                status
            FROM installments
            WHERE school_id=?
                AND is_deleted=FALSE
            `, [schoolId]
        )
        return result
    },

    async getInstallmentById(id, schoolId) {
         const [result] = await pool.execute(
            `
            SELECT
                id,
                student_fee_account_id,
                installment_no,
                amount,
                due_date,
                status
            FROM installments
            WHERE id=?
                AND school_id=?
                AND is_deleted=FALSE
            `, [id,schoolId]
        )
        return result[0]
    },

    async getInstallmentsByStudentFeeAccountId(studentFeeAccountId, schoolId) {
         const [result] = await pool.execute(
            `
            SELECT
                id,
                student_fee_account_id,
                installment_no,
                amount,
                due_date,
                status
            FROM installments
            WHERE student_fee_account_id=?
                AND school_id=?
                AND is_deleted=FALSE
            `, [studentFeeAccountId,schoolId]
        )
        return result
    },


};

module.exports = InstallmentModel;