const StudentFeeService = require("./studentFee.service");
const catchAsync = require("../../../utils/catchAsync");

const StudentFeeController = {

    createStudentFee: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const studentFeeData = req.body;

        const result = await StudentFeeService.createStudentFee(
            schoolId,
            studentFeeData
        );

        return res.status(201).json({
            success: true,
            message: "Student fee assigned successfully",
            data: result
        });
    }),

    getAllStudentFees: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;

        const result = await StudentFeeService.getAllStudentFees(
            schoolId
        );

        return res.status(200).json({
            success: true,
            message: "Student fees fetched successfully",
            data: result
        });
    }),

    getStudentFeeById: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;

        const result = await StudentFeeService.getStudentFeeById(
            id,
            schoolId
        );

        return res.status(200).json({
            success: true,
            message: "Student fee fetched successfully",
            data: result
        });
    }),

    getStudentFeesByStudentId: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { studentId } = req.params;

        const result = await StudentFeeService.getStudentFeesByStudentId(
            studentId,
            schoolId
        );

        return res.status(200).json({
            success: true,
            message: "Student fees fetched successfully",
            data: result
        });
    }),

    updateStatus: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;
        const { status } = req.body;

        const result = await StudentFeeService.updateStatus(
            id,
            schoolId,
            status
        );

        return res.status(200).json({
            success: true,
            message: "Student fee status updated successfully",
            data: result
        });
    }),

    deleteStudentFee: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params;

        const result = await StudentFeeService.deleteStudentFee(
            id,
            schoolId
        );

        return res.status(200).json({
            success: true,
            message: "Student fee deleted successfully",
            data: result
        });
    })
};

module.exports = StudentFeeController;