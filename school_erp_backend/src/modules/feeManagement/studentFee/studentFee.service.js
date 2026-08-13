const StudentFeeModel = require("./studentFee.repository");
const StudentModel = require("../../student/student.repository");
const FeeStructureModel = require("../feeStructure/feeStructure.repository");
const AppError = require("../../../utils/AppError");
const validateSchool = require("../../../utils/validateSchool");

const StudentFeeService = {

    async createStudentFee(schoolId, studentFeeData) {
        const { studentId, feeStructureId } = studentFeeData
        await validateSchool(schoolId)

        const student = await StudentModel.getStudentById(studentId, schoolId)
        if (!student) {
            throw new AppError("Student not found", 404)
        }

        const feeStructure = await FeeStructureModel.getFeeStructureById(feeStructureId, schoolId)
        if (!feeStructure) {
            throw new AppError("Fee Structure not found", 404)
        }
        if (!feeStructure.is_active) {
            throw new AppError("Fee structure is not active", 400);
        }

        const existingFee = await StudentFeeModel.findStudentFee(
            studentId,
            feeStructureId,
            schoolId
        );

        if (existingFee) {
            throw new AppError("Fee already assigned to student", 409);
        }
        const result = await StudentFeeModel.createStudentFee(
            schoolId,
            studentFeeData
        );

        return result;
    },

    async getAllStudentFees(schoolId) {

        await validateSchool(schoolId)
        const result = await StudentFeeModel.getAllStudentFees(schoolId);

        return result;

    },

    async getStudentFeeById(id, schoolId) {
        await validateSchool(schoolId)
        const result = await StudentFeeModel.getStudentFeeById(id, schoolId)

        if (!result) {
            throw new AppError("Student fee not found", 404);
        }


        return result;
    },

    async getStudentFeesByStudentId(studentId, schoolId) {
        await validateSchool(schoolId)
        const result = await StudentFeeModel.getStudentFeesByStudentId(studentId, schoolId)

        if (result.length === 0) {
            throw new AppError("No fees found for this student", 404);
        }


        return result;
    },

    async updateStatus(id, schoolId, status) {
        await validateSchool(schoolId);

        const studentFee = await StudentFeeModel.getStudentFeeById(
            id,
            schoolId
        );

        if (!studentFee) {
            throw new AppError("Student fee not found", 404);
        }

        const result = await StudentFeeModel.updateStatus(
            id,
            schoolId,
            status
        );

        return result;
    },

    async deleteStudentFee(id, schoolId) {
        await validateSchool(schoolId);

        const studentFee = await StudentFeeModel.getStudentFeeById(
            id,
            schoolId
        );

        if (!studentFee) {
            throw new AppError("Student fee not found", 404);
        }

        const result=await StudentFeeModel.deleteStudentFee(id,schoolId)
        return result
    }

};

module.exports = StudentFeeService;