const SchoolService = require("./school.service");
const catchAsync = require("../../utils/catchAsync");

const SchoolController = {

    // Get School Profile
    getSchoolProfile: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId

        const school = await SchoolService.getSchoolProfile(schoolId)

        return res.status(200).json({
            success: true,
            message: "School profile fetched successfully",
            data: school
        })

    }),


    updateSchoolProfile: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId
        const updateData = req.body;
        const result = await SchoolService.updateSchoolProfile(schoolId,updateData)
        
        return res.status(200).json({
            success:true,
            message: "School profile updated successfully.",
            data:result
        })
    }),

    // Update School Status
    updateStatus: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId
        const {status}=req.body
        const result= await SchoolService.updateStatus(schoolId,status)

        return res.status(200).json({
            success:true,
            message:`School status updated successfully.`,
            data:result
        })
    }),

    // Soft Delete School
    deleteSchool: catchAsync(async (req, res, next) => {
        const schoolId = req.query.schoolId

        const result = await SchoolService.deleteSchool(schoolId)

        return res.status(200).json({
            success:true,
            message:"school deleted successfully",
            data:result
        })
    })

};

module.exports = SchoolController;