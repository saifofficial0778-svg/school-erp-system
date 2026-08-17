const StudentFeeAccountService = require("./studentFeeAccount.service");
const catchAsync = require("../../../utils/catchAsync");

const StudentFeeAccountController = {

    createStudentFeeAccount: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const feeAccountData = req.body;

        const result = await StudentFeeAccountService.createStudentFeeAccount(
            schoolId,
            feeAccountData
        );

        return res.status(201).json({
            success: true,
            message: "Student fee account created successfully",
            data: result
        });
    }),

    getAllStudentFeeAccounts: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;

        const result = await StudentFeeAccountService.getAllStudentFeeAccounts(
            schoolId
        );

        return res.status(200).json({
            success: true,
            message: "Student fee accounts fetched successfully",
            data: result
        });
    }),

    getStudentFeeAccountById: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;

        const result = await StudentFeeAccountService.getStudentFeeAccountById(
            id,
            schoolId
        );

        return res.status(200).json({
            success: true,
            message: "Student fee account fetched successfully",
            data: result
        });
    }),

    getStudentFeeAccountByStudentId: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { studentId } = req.params;

        const result = await StudentFeeAccountService.getStudentFeeAccountByStudentId(
            studentId,
            schoolId
        );

        return res.status(200).json({
            success: true,
            message: "Student fee account fetched successfully",
            data: result
        });
    }),

    updateStatus: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;
        const { status } = req.body;

        const result = await StudentFeeAccountService.updateStatus(
            id,
            schoolId,
            status
        );

        return res.status(200).json({
            success: true,
            message: "Student fee account status updated successfully",
            data: result
        });
    }),

    deleteStudentFeeAccount: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;

        const result = await StudentFeeAccountService.deleteStudentFeeAccount(
            id,
            schoolId
        );

        return res.status(200).json({
            success: true,
            message: "Student fee account deleted successfully",
            data: result
        });
    })
};

module.exports = StudentFeeAccountController;