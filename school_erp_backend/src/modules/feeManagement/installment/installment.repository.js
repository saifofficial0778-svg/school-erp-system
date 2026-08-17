const pool = require("../../../config/db");

const InstallmentModel = {

    async createInstallment(schoolId, installmentData) {

        const {
            studentFeeId,
            installmentNo,
            amount,
            dueDate
        } = installmentData;

        const [result] = await pool.execute(
            `
        INSERT INTO installments (
            school_id,
            student_fee_id,
            installment_no,
            amount,
            due_date
        )
        VALUES (?, ?, ?, ?, ?)
        `,
            [
                schoolId,
                studentFeeId,
                installmentNo,
                amount,
                dueDate
            ]
        );

        return result.insertId;
    },

    async getAllInstallments(schoolId) {
        const [result] = await pool.execute(
            `
            SELECT
                id,
                student_fee_id,
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
                student_fee_id,
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

    async getInstallmentsByStudentFeeId(studentFeeId, schoolId) {
         const [result] = await pool.execute(
            `
            SELECT
                id,
                student_fee_id,
                installment_no,
                amount,
                due_date,
                status
            FROM installments
            WHERE student_fee_id=?
                AND school_id=?
                AND is_deleted=FALSE
            `, [studentFeeId,schoolId]
        )
        return result
    },

    async updateInstallment(id, schoolId, installmentData) {

    },

    async updateStatus(id, schoolId, status) {

    },

    async deleteInstallment(id, schoolId) {

    },

    async findInstallment(studentFeeId, installmentNo, schoolId) {

    }

};

module.exports = InstallmentModel;