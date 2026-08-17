const StudentFeeAccountModel = require("./studentFeeAccount.repository");
const StudentModel = require("../../student/student.repository");
const AcademicYearModel = require("../../academicYear/academicYear.repository");
const AppError = require("../../../utils/AppError");
const validateSchool = require("../../../utils/validateSchool");
const StudentFeeModel = require("../studentFee/studentFee.repository");

const StudentFeeAccountService = {

    async createStudentFeeAccount(schoolId, feeAccountData) {
        const { studentId, academicYearId, totalAmount, status } = feeAccountData
        await validateSchool(schoolId)

        const student = await StudentModel.getStudentById(studentId, schoolId)
        if (!student) {
            throw new AppError("Student not found", 404)
        }

        const academicYear = await AcademicYearModel.getAcademicYearById(academicYearId, schoolId)
        if (!academicYear) {
            throw new AppError("Academic Year not found", 404)
        }

        const existingAccount =await StudentFeeAccountModel.findStudentFeeAccount(studentId,academicYearId,schoolId);
        if (existingAccount) {
            throw new AppError("Student fee account already exists for this academic year",409);
        }

        const studentFees =await StudentFeeModel.getStudentFeesByStudentId(studentId,schoolId);
        if (studentFees.length === 0) {
            throw new AppError("No student fees found", 404);
        }

        const feeTotal = await StudentFeeModel.getStudentFeeTotal(studentId,schoolId);
        if (!feeTotal.total_amount) {
            throw new AppError("No student fee found", 404);
        }

        const feeAccountDataForCreate = {
                ...feeAccountData,
                totalAmount: feeTotal.total_amount,
                status: status || "Pending"
        };

        const result = await StudentFeeAccountModel.createStudentFeeAccount(schoolId,feeAccountDataForCreate);

        return result;

    
    },

    async getAllStudentFeeAccounts(schoolId) {
        await validateSchool(schoolId);

        const result =await StudentFeeAccountModel.getAllStudentFeeAccounts(schoolId);

        return result;
    },

    async getStudentFeeAccountById(id, schoolId) {
        await validateSchool(schoolId);

        const result =await StudentFeeAccountModel.getStudentFeeAccountById(id,schoolId)
        if (!result) {
            throw new AppError("Student fee account not found", 404);
        }

        return result;
    },

    async getStudentFeeAccountByStudentId(studentId, schoolId) {
        await validateSchool(schoolId);

        const result =await StudentFeeAccountModel.getStudentFeeAccountByStudentId(studentId,schoolId)
        if (result.length === 0) {
            throw new AppError("Student fee account not found", 404);
        }

        return result;
    },

    async updateStatus(id, schoolId, status) {
         await validateSchool(schoolId);
         const account = await StudentFeeAccountModel.getStudentFeeAccountById(id,schoolId);

        if (!account) {
            throw new AppError("Student fee account not found", 404);
        }

         const result=await StudentFeeAccountModel.updateStatus(id,schoolId,status)

         return result

    },

    async deleteStudentFeeAccount(id, schoolId) {
        await validateSchool(schoolId);
        const account = await StudentFeeAccountModel.getStudentFeeAccountById(id,schoolId);

        if (!account) {
            throw new AppError("Student fee account not found", 404);
        }

         const result=await StudentFeeAccountModel.deleteStudentFeeAccount(id,schoolId)

         return result

    }

};

module.exports = StudentFeeAccountService;