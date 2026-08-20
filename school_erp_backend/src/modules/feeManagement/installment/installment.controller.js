const InstallmentService = require("./installment.service");
const catchAsync = require("../../../utils/catchAsync");

const InstallmentController = {

    getAllInstallments: catchAsync(async (req, res) => {
        const schoolId = req.query.schoolId;

        const result = await InstallmentService.getAllInstallments(schoolId);

        return res.status(200).json({
            success: true,
            message: "Installments fetched successfully",
            data: result
        });
    }),

    getInstallmentById: catchAsync(async (req, res) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;

        const result = await InstallmentService.getInstallmentById(
            id,
            schoolId
        );

        return res.status(200).json({
            success: true,
            message: "Installment fetched successfully",
            data: result
        });
    }),

    getInstallmentsByStudentFeeAccountId: catchAsync(async (req, res) => {
        const schoolId = req.query.schoolId;
        const { studentFeeAccountId } = req.params;

        const result =
            await InstallmentService.getInstallmentsByStudentFeeAccountId(
                studentFeeAccountId,
                schoolId
            );

        return res.status(200).json({
            success: true,
            message: "Installments fetched successfully",
            data: result
        });
    })

};

module.exports = InstallmentController;