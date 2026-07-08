const ClassModel = require('../models/classModel');
const pool = require('../config/db');
const catchAsync = require('../utils/catchAsync'); // 🔥 Error wrapper attached
const AppError = require('../utils/AppError');     // 🔥 Custom operational exception helper

// 1. 🏫 CREATE NEW CLASS CLUSTER
exports.addClass = catchAsync(async (req, res, next) => {
    const { class_name, section, teacher_id } = req.body;
    const school_id = req.user.schoolId;

    // Validation check using core operational AppError wrapper
    if (!class_name || !section) {
        return next(new AppError("Bhai, Class Name aur Section details fill karna mandatory hai!", 400));
    }

    const classId = await ClassModel.createClass(school_id, class_name, section, teacher_id);

    res.status(201).json({
        success: true,
        message: "Class successfully create ho gayi! 🏫",
        classId
    });
});

// 2. 📊 GET ALL CLASSES & TEACHERS LOGS (Dropdown matrices selector)
exports.getClassDropdownData = catchAsync(async (req, res, next) => {
    const school_id = req.user.schoolId;

    const classes = await ClassModel.getAllClasses(school_id);
    
    // Fetch live staff data straight from MySQL pool connection layer
    const [teachers] = await pool.query(
        `SELECT id, full_name FROM teachers WHERE school_id = ?`, 
        [school_id]
    );
    
    res.status(200).json({
        success: true,
        classes,
        teachers
    });
});

// 3. 🔗 MAP STUDENT WITH TARGETED MONTHLY FEES INDEX
exports.assignStudent = catchAsync(async (req, res, next) => {
    const { student_id, class_id, academic_year, assigned_monthly_fee } = req.body;
    const school_id = req.user.schoolId;

    // Constraint payload scanning structure
    if (!student_id || !class_id || !academic_year) {
        return next(new AppError("Bhai, transactional mapping ke liye Student ID, Class, aur Academic Year fields zaroori hain!", 400));
    }

    await ClassModel.assignStudentToClass(
        school_id, 
        student_id, 
        class_id, 
        academic_year, 
        assigned_monthly_fee || 0
    );

    res.status(200).json({
        success: true,
        message: "Student ko class aur custom fee successfully assign ho gayi! 🎯🚀"
    });
});