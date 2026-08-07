const TeacherService = require("./teacher.service");
const catchAsync = require("../../utils/catchAsync");


const TeacherController = {
    createTeacher: catchAsync(async (req, res) => {

        const schoolId = req.query.schoolId;
        const teacherData = req.body;

        const teacher = await TeacherService.createTeacher(
            schoolId,
            teacherData
        );

        return res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            data: teacher
        });

    }),

    getAllTeachers: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId

        const teachers = await TeacherService.getAllTeachers(schoolId)
        return res.status(200).json({
            success: true,
            message: "All teachers fetched successfully",
            data: teachers
        })
    }),

    getTeacherById: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId
        const { id } = req.params

        const teacher = await TeacherService.getTeacherById(id, schoolId)
        return res.status(200).json({
            success: true,
            message: "teacher fetched successfully",
            data: teacher
        })
    }),

    updateTeacher: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId
        const teacherData = req.body
        const { id } = req.params

        const result = await TeacherService.updateTeacher(id, schoolId, teacherData)
        return res.status(200).json({
            success: true,
            message: "Teacher profile updated successfully",
            data: result
        })
    }),

    updateStatus: catchAsync(async (req, res, next) => {

        const schoolId = req.query.schoolId;
        const {status } = req.body;
        const {id}=req.params

        const result = await TeacherService.updateStatus(
            id,
            schoolId,
            status
        );

        return res.status(200).json({
            success: true,
            message: "Teacher status updated successfully",
            data: result
        });

    }),

    deleteTeacher: catchAsync(async (req, res, next) => {
        const schoolId=req.query.schoolId
        const {id}=req.params

        const result=await TeacherService.deleteTeacher(id,schoolId)
        return res.status(200).json({
            success:true,
            message:"teacher Deleted(soft) successfully",
            data:result
        })
    })

};

module.exports = TeacherController;

