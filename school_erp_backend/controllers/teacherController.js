const Teacher = require('../models/teacherModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


exports.getAllTeachers = catchAsync(async (req, res) => {
    const schoolId = req.user.schoolId;

    const data = await Teacher.fetchAllBaseProfiles(schoolId);
    res.status(200).json({ success: true, count: data.length, data });
});

exports.getTeacherById = catchAsync(async (req, res, next) => {
    const { teacherId } = req.params;
    const schoolId = req.user.schoolId;

    const teacher = await Teacher.getTeacherById(schoolId, teacherId);

    if (!teacher) {
        return next(new AppError('Bhaya, is ID ka koi teacher nahi mila!', 404));
    }

    res.status(200).json({
        success: true,
        data: teacher
    });
});

exports.createTeacher = catchAsync(async (req, res, next) => {
    const schoolId = req.user.schoolId;
    // ✅ password nahi chahiye - backend generate karega, student jaisa hi
    const {
        email, fullName, phone, qualification, specialization,
        experienceYears, previousSchool, joiningDate, dateOfBirth, gender,
        address, bankName, accountNumber, ifscCode, accountHolderName,
        accountType, salary
    } = req.body;

    // Personal info + qualification section ke mandatory fields
    if (!email || !fullName || !qualification || !salary) {
        return next(new AppError(
            "Mandatory fields missing: email, fullName, qualification, salary",
            400
        ));
    }

    const result = await Teacher.createTeacherTransaction(
        schoolId, email, fullName, phone, qualification, specialization,
        experienceYears, previousSchool, joiningDate, dateOfBirth, gender,
        address, bankName, accountNumber, ifscCode, accountHolderName,
        accountType, salary
    );

    res.status(201).json({
        success: true,
        message: "Teacher enrolled successfully!",
        teacher: { id: result.id, fullName: result.fullName, qualification: result.qualification },
        credentials: result.credentials  // { email, password } frontend modal ke liye
    });
});

exports.updateTeacher = catchAsync(async (req, res, next) => {
    const { teacherId } = req.params;

    const {
        email, fullName, phone, qualification, specialization,
        experienceYears, previousSchool, joiningDate, dateOfBirth, gender,
        address, bankName, accountNumber, ifscCode, accountHolderName,
        accountType, salary
    } = req.body;

    if (!email || !fullName || !qualification) {
        return next(new AppError(
            "Bhai, Email, Full Name aur Qualification bharna mandatory hai!",
            400
        ));
    }

    const result = await Teacher.updateTeacherTransaction(
        teacherId, email, fullName, phone, qualification, specialization,
        experienceYears, previousSchool, joiningDate, dateOfBirth, gender,
        address, bankName, accountNumber, ifscCode, accountHolderName,
        accountType, salary
    );

    res.status(200).json({
        success: true,
        message: result.message || "Teacher profile updated successfully!",
        data: {
            teacherId,
            fullName,
            email
        }
    });
});

exports.deleteTeacher = catchAsync(async (req, res) => {
    const { teacherId } = req.params;
    const schoolId = req.user.schoolId;

    const result = await Teacher.deleteTeacherTransaction(schoolId, teacherId);

    res.status(200).json({
        success: true,
        message: result.message
    });
});

exports.getTeacherCompleteProfile = catchAsync(async (req, res, next) => {
    const { teacherId } = req.params;
    if (req.user.role === 'Teacher' && req.user.id !== teacherIdId) {
            return res.status(403).json({ 
                success: false, 
                message: "Bhai, chalaaki nahi! Aap sirf apni profile dekh sakte ho, kisi aur ki nahi." 
            });
        }
    const schoolId = req.user.schoolId;

    const allData = await Teacher.getTeacherCompleteProfile(schoolId, teacherId);

    if (!allData) {
        return next(new AppError('Bhaya, is teacher ka records nahi mila!', 404));
    }

    res.status(200).json({
        success: true,
        data: allData
    });
});