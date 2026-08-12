const FeeStructureService = require("./feeStructure.service");
const catchAsync = require("../../../utils/catchAsync");

const FeeStructureController = {

    createFeeStructure: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const feeStructureData = req.body;

        const result = await FeeStructureService.createFeeStructure(
            schoolId,
            feeStructureData
        );

        return res.status(201).json({
            success: true,
            message: "Fee structure created successfully",
            data: result
        });
    }),

    getAllFeeStructures: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;

        const result = await FeeStructureService.getAllFeeStructures(schoolId);

        return res.status(200).json({
            success: true,
            message: "Fee structures fetched successfully",
            data: result
        });
    }),

    getFeeStructureById: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;

        const result = await FeeStructureService.getFeeStructureById(
            id,
            schoolId
        );

        return res.status(200).json({
            success: true,
            message: "Fee structure fetched successfully",
            data: result
        });
    }),

    updateFeeStructure: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;
        const feeStructureData = req.body;

        const result = await FeeStructureService.updateFeeStructure(
            id,
            schoolId,
            feeStructureData
        );

        return res.status(200).json({
            success: true,
            message: "Fee structure updated successfully",
            data: result
        });
    }),

    updateStatus: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;
        const { status } = req.body;

        const result = await FeeStructureService.updateStatus(
            id,
            schoolId,
            status
        );

        return res.status(200).json({
            success: true,
            message: "Fee structure status updated successfully",
            data: result
        });
    }),

    deleteFeeStructure: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;

        const result = await FeeStructureService.deleteFeeStructure(
            id,
            schoolId
        );

        return res.status(200).json({
            success: true,
            message: "Fee structure deleted successfully",
            data: result
        });
    })
};

module.exports = FeeStructureController;