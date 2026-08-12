const FeeStructureModel = require("./feeStructure.repository");
const AppError = require("../../../utils/AppError");
const validateSchool = require("../../../utils/validateSchool");
const AcademicYear = require('../../academicYear/academicYear.repository')
const ClassModel = require("../../class/class.repository");
const FeeTypeModel = require("../feeType/feeType.repository");

const FeeStructureService = {

    async createFeeStructure(schoolId, feeStructureData) {

        await validateSchool(schoolId);

        const {
            academicYearId,
            classId,
            feeTypeId,
            amount,
            frequency
        } = feeStructureData;

        const academicYear = await AcademicYear.getAcademicYearById(academicYearId, schoolId)
        if (!academicYear) {
            throw new AppError("Academic year not found", 404)
        }

        const classExist = await ClassModel.getClassById(classId, schoolId)
        if (!classExist) {
            throw new AppError("Class not found", 404)
        }

        const feeType = await FeeTypeModel.getFeeTypeById(feeTypeId, schoolId)
        if (!feeType) {
            throw new AppError("fee type not found", 404)
        }
        if (amount <= 0) {
            throw new AppError("Amount must be greater than 0", 400);
        }

        const feeStructure = await FeeStructureModel.findFeeStructure(schoolId, academicYearId, classId, feeTypeId)
        if (feeStructure) {
            throw new AppError("fee structure already exists", 409)
        }

        const result = await FeeStructureModel.createFeeStructure(schoolId, feeStructureData)
        return result
    },

    async getAllFeeStructures(schoolId) {
        await validateSchool(schoolId);

        const result = await FeeStructureModel.getAllFeeStructures(schoolId)
        return result
    },

    async getFeeStructureById(id, schoolId) {
        await validateSchool(schoolId);

        const result = await FeeStructureModel.getFeeStructureById(id, schoolId)

        if (!result) {
            throw new AppError("Fee structure not found", 404);
        }
        return result
    },

    async updateFeeStructure(id, schoolId, feeStructureData) {
        await validateSchool(schoolId);

        const {
            academicYearId,
            classId,
            feeTypeId,
            amount,
            frequency
        } = feeStructureData;

        const feeStructure = await FeeStructureModel.getFeeStructureById(
            id,
            schoolId
        );

        if (!feeStructure) {
            throw new AppError("Fee structure not found", 404);
        }

        const academicYear = await AcademicYear.getAcademicYearById(
            academicYearId,
            schoolId
        );

        if (!academicYear) {
            throw new AppError("Academic year not found", 404);
        }

        const classExist = await ClassModel.getClassById(
            classId,
            schoolId
        );

        if (!classExist) {
            throw new AppError("Class not found", 404);
        }

        const feeType = await FeeTypeModel.getFeeTypeById(
            feeTypeId,
            schoolId
        );

        if (!feeType) {
            throw new AppError("Fee type not found", 404);
        }

        if (amount <= 0) {
            throw new AppError("Amount must be greater than 0", 400);
        }

        const existingFeeStructure =
            await FeeStructureModel.findFeeStructureForUpdate(
                schoolId,
                academicYearId,
                classId,
                feeTypeId,
                id
            );

        if (existingFeeStructure) {
            throw new AppError("Fee structure already exists", 409);
        }

        const result = await FeeStructureModel.updateFeeStructure(
            id,
            schoolId,
            feeStructureData
        );

        return result;
    },

    async updateStatus(id, schoolId, status) {
        await validateSchool(schoolId);

        const feeStructure =
            await FeeStructureModel.getFeeStructureById(id, schoolId);

        if (!feeStructure) {
            throw new AppError("Fee structure not found", 404);
        }

        const isActive = status === "Active";

        const result = await FeeStructureModel.updateStatus(
            id,
            schoolId,
            isActive
        );

        return result;
    },




    async deleteFeeStructure(id, schoolId) {
        await validateSchool(schoolId);

        const feeStructure = await FeeStructureModel.getFeeStructureById(
            id,
            schoolId
        );

        if (!feeStructure) {
            throw new AppError("Fee structure not found", 404);
        }

        const result = await FeeStructureModel.deleteFeeStructure(id, schoolId)
        return result

    }

};

module.exports = FeeStructureService;