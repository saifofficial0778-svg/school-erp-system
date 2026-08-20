const InstallmentModel = require("./installment.repository");
const StudentFeeAccountModel = require("../studentFeeAccount/studentFeeAccount.repository");
const AppError = require("../../../utils/AppError");
const validateSchool = require("../../../utils/validateSchool");

const InstallmentService = {

    async getAllInstallments(schoolId) {
        await validateSchool(schoolId)

        const result = await InstallmentModel.getAllInstallments(schoolId)
        return result

    },

    async getInstallmentById(id, schoolId) {
        await validateSchool(schoolId)

        const result = await InstallmentModel.getInstallmentById(id, schoolId)
        if (!result){
            throw new AppError("Installment not found",404)
        }

            return result
    },

    async getInstallmentsByStudentFeeAccountId(studentFeeAccountId, schoolId) {
        await validateSchool(schoolId)

        const result = await InstallmentModel.getInstallmentsByStudentFeeAccountId(studentFeeAccountId,schoolId)
        if (result.length===0){
            throw new AppError("Installment not found",404)
        }

            return result
    }

};

module.exports = InstallmentService;