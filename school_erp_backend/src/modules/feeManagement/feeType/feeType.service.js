const FeeTypeModel = require("./feeType.repository");
const SchoolModel = require("../../school/school.repository");
const AppError = require("../../../utils/AppError");
const validateSchool = require("../../../utils/validateSchool");

const FeeTypeService = {

    async createFeeType(schoolId, feeTypeData) {
        await validateSchool(schoolId);

        const { name, description } = feeTypeData;
        if (!name) {
            throw new AppError("Fee type name is required", 400);
        }

        const existingFeeTypeName = await FeeTypeModel.findFeeTypeByName(name, schoolId)
        if (existingFeeTypeName) {
            throw new AppError("fee tpye name is alredy exists", 409)
        }

        const result = await FeeTypeModel.createFeeType(schoolId, feeTypeData)
        return result
    },

    async getAllFeeTypes(schoolId) {
        await validateSchool(schoolId);
        const result = await FeeTypeModel.getAllFeeTypes(schoolId)
        return result
    },

    async getFeeTypeById(id, schoolId) {
        await validateSchool(schoolId);

        const feeType = await FeeTypeModel.getFeeTypeById(id, schoolId);

        if (!feeType) {
            throw new AppError("Fee type not found", 404);
        }

        return feeType;
    },

    async updateFeeType(id, schoolId, feeTypeData) {
        await validateSchool(schoolId);

        const feeType = await FeeTypeModel.getFeeTypeById(id, schoolId);

        if (!feeType) {
            throw new AppError("Fee type not found", 404);
        }

        const { name, description } = feeTypeData;

        if (!name) {
            throw new AppError("Fee type name is required", 400);
        }

        const existingFeeType = await FeeTypeModel.findFeeTypeByNameForUpdate(
            name,
            schoolId,
            id
        );

        if (existingFeeType) {
            throw new AppError("Fee type name already exists", 409);
        }

        const result = await FeeTypeModel.updateFeeType(
            id,
            schoolId,
            feeTypeData
        );

        return result;
    },

    async updateStatus(id, schoolId, status) {
        await validateSchool(schoolId);

        const feeType = await FeeTypeModel.getFeeTypeById(id, schoolId);

        if (!feeType) {
            throw new AppError("Fee type not found", 404);
        }
         const isActive = status === "Active";
        const result=await FeeTypeModel.updateStatus(id,schoolId,isActive)
        return result

    },

    async deleteFeeType(id, schoolId) {
        await validateSchool(schoolId);

        const feeType = await FeeTypeModel.getFeeTypeById(id, schoolId);

        if (!feeType) {
            throw new AppError("Fee type not found", 404);
        }
        const result=await FeeTypeModel.deleteFeeType(id,schoolId)
        return result
    }

};

module.exports = FeeTypeService;