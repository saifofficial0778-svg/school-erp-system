const ClassModel = require("./class.repository");
const AcademicYear = require('../academicYear/academicYear.repository')
const AppError = require('../../utils/AppError');


const ClassService = {

    async createClass(schoolId, academicYearId, className) {
        const isAcaedmicYear = await AcademicYear.getAcademicYearById(academicYearId, schoolId)
        if (!isAcaedmicYear) {
            throw new AppError("Academic Year not exists", 404)
        }
        if (isAcaedmicYear.status !== 'Active') {
            throw new AppError("Class can only be created in an Active Academic Year.", 400)
        }

        const isClass = await ClassModel.getClassByName(className, academicYearId, schoolId)

        if (isClass) {
            throw new AppError("Class already exists", 409)
        }

        const newClass = await ClassModel.createClass(
            schoolId,
            academicYearId,
            className
        );

        return newClass;
    },

    async getAllClasses(schoolId) {
        return await ClassModel.getAllClasses(schoolId)


    },

    async getClassById(id, schoolId) {
        const result = await ClassModel.getClassById(id, schoolId)

        if (!result) {
            throw new AppError("Class not found", 404)
        }
        return result

    },

    async updateClass(id, schoolId, academicYearId, className) {
        const existingClass = await ClassModel.getClassById(id, schoolId)
        if (!existingClass) {
            throw new AppError("class not found", 404)
        }

        const isClassByName = await ClassModel.getClassByName(className, schoolId, academicYearId)
        if (isClassByName && isClassByName.id !== Number(id)) {
            throw new AppError("Class already exists.", 409)
        }

        const result = await ClassModel.updateClass(id, schoolId, academicYearId, className)
        return result

    },

    async updateStatus(id, schoolId, status) {
        const existingClass = await ClassModel.getClassById(id, schoolId)
        if (!existingClass) {
            throw new AppError("class not found", 404)
        }

        const allowedStatus = ["Active", "Inactive"];

        if (!allowedStatus.includes(status)) {
            throw new AppError("Invalid status.", 400);
        }
        if (existingClass.status === status) {
            throw new AppError(`Class is already ${status}.`, 400);
        }

        const result = await ClassModel.updateStatus(id,status,schoolId)
        return result
    },

    async deleteClass(id,schoolId) {

        const existingClass = await ClassModel.getClassById(id, schoolId)
        if (!existingClass) {
            throw new AppError("class not found", 404)
        }

        if(existingClass.is_deleted){
             throw new AppError("class is already deleted", 400)
        }
        return await ClassModel.deleteClass(id,schoolId)

    }

};

module.exports = ClassService;