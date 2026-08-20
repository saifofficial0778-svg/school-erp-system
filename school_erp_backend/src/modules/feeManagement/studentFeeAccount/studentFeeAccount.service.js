const StudentFeeAccountModel = require("./studentFeeAccount.repository");
const StudentModel = require("../../student/student.repository");
const AcademicYearModel = require("../../academicYear/academicYear.repository");
const AppError = require("../../../utils/AppError");
const validateSchool = require("../../../utils/validateSchool");
const StudentFeeModel = require("../studentFee/studentFee.repository");
const pool = require('../../../config/db')

const StudentFeeAccountService = {

    async createStudentFeeAccount(schoolId, feeAccountData) {
        const {
            studentId,
            academicYearId,
            installmentPlan,
            startDate
        } = feeAccountData;

        await validateSchool(schoolId);

        const student = await StudentModel.getStudentById(
            studentId,
            schoolId
        );

        if (!student) {
            throw new AppError("Student not found", 404);
        }

        const academicYear = await AcademicYearModel.getAcademicYearById(
            academicYearId,
            schoolId
        );

        if (!academicYear) {
            throw new AppError("Academic Year not found", 404);
        }

        const existingAccount =
            await StudentFeeAccountModel.findStudentFeeAccount(
                studentId,
                academicYearId,
                schoolId
            );

        if (existingAccount) {
            throw new AppError(
                "Student fee account already exists for this academic year",
                409
            );
        }

        const studentFees =
            await StudentFeeModel.getStudentFeesByStudentId(
                studentId,
                schoolId
            );

        if (studentFees.length === 0) {
            throw new AppError("No student fees found", 404);
        }

        const feeTotal = await StudentFeeModel.getStudentFeeTotal(
            studentId,
            schoolId
        );

        if (!feeTotal || !feeTotal.total_amount) {
            throw new AppError("No student fee found", 404);
        }

        const totalAmount = Number(feeTotal.total_amount);

        let installmentCount;

        switch (installmentPlan) {
            case "Monthly":
                installmentCount = 12;
                break;

            case "Quarterly":
                installmentCount = 4;
                break;

            case "Half-Yearly":
                installmentCount = 2;
                break;

            case "One-Time":
                installmentCount = 1;
                break;

            default:
                throw new AppError("Invalid installment plan", 400);
        }

        const firstDueDate = new Date(startDate);

        if (Number.isNaN(firstDueDate.getTime())) {
            throw new AppError("Invalid start date", 400);
        }

        const baseAmount = Math.floor(
            (totalAmount / installmentCount) * 100
        ) / 100;

        const installments = [];

        for (let i = 0; i < installmentCount; i++) {
            const dueDate = new Date(firstDueDate);

            if (installmentPlan === "Monthly") {
                dueDate.setMonth(dueDate.getMonth() + i);
            } else if (installmentPlan === "Quarterly") {
                dueDate.setMonth(dueDate.getMonth() + i * 3);
            } else if (installmentPlan === "Half-Yearly") {
                dueDate.setMonth(dueDate.getMonth() + i * 6);
            }

            const amount =
                i === installmentCount - 1
                    ? Number(
                        (
                            totalAmount -
                            baseAmount * (installmentCount - 1)
                        ).toFixed(2)
                    )
                    : baseAmount;

            installments.push({
                installmentNo: i + 1,
                amount,
                dueDate: dueDate.toISOString().split("T")[0]
            });
        }

        const feeAccountDataForCreate = {
            studentId,
            academicYearId,
            totalAmount
        };

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const accountId =
                await StudentFeeAccountModel.createStudentFeeAccount(
                    connection,
                    schoolId,
                    feeAccountDataForCreate
                );

            await StudentFeeAccountModel.createInstallments(
                connection,
                schoolId,
                accountId,
                installments
            );

            await connection.commit();

            return {
                accountId,
                totalAmount,
                installmentPlan,
                installments
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async getAllStudentFeeAccounts(schoolId) {
        await validateSchool(schoolId);

        const result = await StudentFeeAccountModel.getAllStudentFeeAccounts(schoolId);

        return result;
    },

    async getStudentFeeAccountById(id, schoolId) {
        await validateSchool(schoolId);

        const result = await StudentFeeAccountModel.getStudentFeeAccountById(id, schoolId)
        if (!result) {
            throw new AppError("Student fee account not found", 404);
        }

        return result;
    },

    async getStudentFeeAccountByStudentId(studentId, schoolId) {
        await validateSchool(schoolId);

        const result = await StudentFeeAccountModel.getStudentFeeAccountByStudentId(studentId, schoolId)
        if (result.length === 0) {
            throw new AppError("Student fee account not found", 404);
        }

        return result;
    },

    async updateStatus(id, schoolId, status) {
        await validateSchool(schoolId);
        const account = await StudentFeeAccountModel.getStudentFeeAccountById(id, schoolId);

        if (!account) {
            throw new AppError("Student fee account not found", 404);
        }

        const result = await StudentFeeAccountModel.updateStatus(id, schoolId, status)

        return result

    },

    async deleteStudentFeeAccount(id, schoolId) {
        await validateSchool(schoolId);
        const account = await StudentFeeAccountModel.getStudentFeeAccountById(id, schoolId);

        if (!account) {
            throw new AppError("Student fee account not found", 404);
        }

        const result = await StudentFeeAccountModel.deleteStudentFeeAccount(id, schoolId)

        return result

    }

};

module.exports = StudentFeeAccountService;