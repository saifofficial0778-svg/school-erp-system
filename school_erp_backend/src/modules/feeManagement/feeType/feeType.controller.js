const FeeTypeService = require("./feeType.service");
const catchAsync = require("../../../utils/catchAsync");

const FeeTypeController = {

    createFeeType: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const feeTypeData = req.body;

        const result = await FeeTypeService.createFeeType(
            schoolId,
            feeTypeData
        );

        return res.status(201).json({
            success: true,
            message: "Fee type created successfully",
            data: result
        });
    }),

    getAllFeeTypes: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;

        const result = await FeeTypeService.getAllFeeTypes(schoolId);

        return res.status(200).json({
            success: true,
            message: "Fee types fetched successfully",
            data: result
        });
    }),

    getFeeTypeById: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;

        const result = await FeeTypeService.getFeeTypeById(
            id,
            schoolId
        );

        return res.status(200).json({
            success: true,
            message: "Fee type fetched successfully",
            data: result
        });
    }),

    updateFeeType: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;
        const feeTypeData = req.body;

        const result = await FeeTypeService.updateFeeType(
            id,
            schoolId,
            feeTypeData
        );

        return res.status(200).json({
            success: true,
            message: "Fee type updated successfully",
            data: result
        });
    }),

    updateStatus: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;
        const { status } = req.body;

        const result = await FeeTypeService.updateStatus(
            id,
            schoolId,
            status
        );

        return res.status(200).json({
            success: true,
            message: "Fee type status updated successfully",
            data: result
        });
    }),

    deleteFeeType: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;

        const result = await FeeTypeService.deleteFeeType(
            id,
            schoolId
        );

        return res.status(200).json({
            success: true,
            message: "Fee type deleted successfully",
            data: result
        });
    })
};

module.exports = FeeTypeController;