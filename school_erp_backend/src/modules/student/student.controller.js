const StudentService = require("./student.service");
const catchAsync = require("../../utils/catchAsync");

const StudentController = {

    createStudent: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const studentData=req.body

        const student=await StudentService.createStudent(schoolId,studentData)
        return res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student
        });
    }),

    getAllStudents: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;

        const students= await StudentService.getAllStudents(schoolId)
        return res.status(201).json({
            success: true,
            message: "Students fetched successfully",
            data: students
        });
    }),

    getStudentById: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const {id}=req.params

        const student=await StudentService.getStudentById(id,schoolId)
        return res.status(201).json({
            success: true,
            message: "Student fetched successfully",
            data: student
        });
    }),

    updateStudent: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const studentData=req.body
        const { id } = req.params

        const result=await StudentService.updateStudent(id,schoolId,studentData)
        return res.status(201).json({
            success: true,
            message: "Student profile updated successfully",
            data: result
        });
    }),

    updateStatus: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId;
        const { id } = req.params
        const {status } = req.body;

        const result=await StudentService.updateStatus(id,schoolId,status)
        return res.status(201).json({
            success: true,
            message: "Student status updated successfully",
            data: result
        });

    }),

    deleteStudent: catchAsync(async (req, res, next) => {
        const schoolId=req.query.schoolId
        const {id}=req.params

        const result= await StudentService.deleteStudent(id,schoolId)
        return res.status(201).json({
            success: true,
            message: "Student status updated successfully",
            data: result
        });
    })

};

module.exports = StudentController;