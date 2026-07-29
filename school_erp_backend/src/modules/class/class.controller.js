const ClassService = require("./class.service");
const catchAsync = require("../../utils/catchAsync");

const ClassController = {

    createClass: catchAsync(async (req, res, next) => {
        const {academicYearId , className}=req.body
        const schoolId=req.query.schoolId

        const result=await ClassService.createClass(schoolId,academicYearId,className)

        return res.status(201).json({
            success:true,
            message:"Class successfully Created",
            data:{
                id:result
            }
        })
    }),

    getAllClasses: catchAsync(async (req, res, next) => {
        const schoolId=req.query.schoolId

        const result=await ClassService.getAllClasses(schoolId)

        return res.status(200).json({
            success:true,
            message:"All classes fetched successfully",
            data:result
        })
    }),

    getClassById: catchAsync(async (req, res, next) => {
        const schoolId=req.query.schoolId
        const {id}=req.params
        const result= await ClassService.getClassById(id,schoolId)

        return res.status(200).json({
            success:true,
            message:"class fetched successfully",
            data:result
        })

    }),

    updateClass: catchAsync(async (req, res, next) => {
        const schoolId=req.query.schoolId
        const {className,academicYearId}=req.body
        const {id}=req.params

        const result=await ClassService.updateClass(id,schoolId,academicYearId,className)
        
        return res.status(200).json({
            success:true,
            message:"Class updated successfully",
            data:result
        })
    }),

    updateStatus: catchAsync(async (req, res, next) => {
        const schoolId=req.query.schoolId
        const {id}=req.params
        const {status}=req.body

        const result = await ClassService.updateStatus(id,schoolId,status)

        return res.status(200).json({
            success:true,
            message:"status updated successfully",
            data:result
        })
    }),

    deleteClass: catchAsync(async (req, res, next) => {
        const schoolId=req.query.schoolId
        const {id}=req.params

        const result =await ClassService.deleteClass(id,schoolId)

        return res.status(200).json({
            success:true,
            message:"Class deleted(soft)",
            data:result
        })
    })

};

module.exports = ClassController;