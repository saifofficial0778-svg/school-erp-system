const AcademicYear = require('../models/academicYearModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')

exports.createAcademicYear = catchAsync(async (req, res, next) => {
    const { session, startDate, endDate } = req.body;
    const schoolId = req.query.schoolId;

    if (!session || !startDate || !endDate) {
        return next(new AppError("Session, Start Date and End Date are required.", 400));
    }

    const sessionRegex = /^\d{4}-\d{2}$/;

    if (!sessionRegex.test(session)) {
        return next(new AppError("Invalid session format. Use YYYY-YY (e.g. 2026-27).", 400));
    }

    const existingAcademicYear = await AcademicYear.getAcademicYearBySession(session, schoolId)
    if (existingAcademicYear) {
        return next(new AppError("Academic Year already exists for this school.", 409))
    }

    const total = await AcademicYear.countAcademicYears(schoolId);
    let status;

    if (total === 0) {
        status = "Active";
    } else {
        status = "Upcoming";
    }

    const newAcademicYear = await AcademicYear.createAcademicYear(schoolId, session, startDate, endDate, status)

      res.status(201).json({
        success: true,
        message: "Academic Year created successfully",
        data: newAcademicYear
    });

})

exports.getAllAcademicYears = async (req, res) => { }

exports.getAcademicYearById = async (req, res) => { }

exports.updateAcademicYear = async (req, res) => { }

exports.activateAcademicYear = async (req, res) => { }