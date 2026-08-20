const pool = require("../../../config/db");

const StudentFeeAccountModel = {

    async createStudentFeeAccount(connection, schoolId, feeAccountData) {
        const {
            studentId,
            academicYearId,
            totalAmount
        } = feeAccountData;

        const [result] = await connection.execute(
            `
        INSERT INTO student_fee_accounts (
            school_id,
            student_id,
            academic_year_id,
            total_amount,
            status
        )
        VALUES (?, ?, ?, ?, 'Pending')
        `,
            [
                schoolId,
                studentId,
                academicYearId,
                totalAmount
            ]
        );

        return result.insertId;
    },

    async createInstallments(connection, schoolId, accountId, installments) {
        for (const installment of installments) {

            await connection.execute(
                `
            INSERT INTO installments (
                school_id,
                student_fee_account_id,
                installment_no,
                amount,
                due_date,
                status
            )
            VALUES (?, ?, ?, ?, ?, 'Pending')
            `,
                [
                    schoolId,
                    accountId,
                    installment.installmentNo,
                    installment.amount,
                    installment.dueDate
                ]
            );

        }
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