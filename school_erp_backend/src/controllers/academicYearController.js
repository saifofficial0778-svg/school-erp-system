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

exports.getAllAcademicYears = catchAsync(async (req, res, next) => {
    const schoolId = req.query.schoolId;
    const getAcademicYears = await AcademicYear.getAllAcademicYears(schoolId)

    if (getAcademicYears.length === 0) {
        return res.status(200).json({ success: true, message: "No academic years found.", data: [] })
    }

    return res.status(200).json({
        success: true,
        message: "Academic years are fetched successfully",
        data: getAcademicYears
    })
})

exports.getAcademicYearById = catchAsync(async (req, res, next) => {
    const schoolId = req.query.schoolId;
    const { id } = req.params;
    const getAcademicYears = await AcademicYear.getAcademicYearById(id, schoolId)

    if (!getAcademicYears) {
        return res.status(404).json({
            success: false,
            message: "Academic year not found."
        });
    }

    return res.status(200).json({
        success: true,
        message: "Academic year is fetched successfully",
        data: getAcademicYears
    })
})

exports.updateAcademicYear = catchAsync(async (req, res, next) => {
    const schoolId = req.query.schoolId
    const { id } = req.params
    const { session, startDate, endDate } = req.body

    const getAcademicYears = await AcademicYear.getAcademicYearById(id, schoolId)

    if (!getAcademicYears) {
        return res.status(404).json({
            success: false,
            message: "Academic year not found."
        });
    }

    if (!session || !startDate || !endDate) {
        return next(new AppError("Session, Start Date and End Date are required.", 400));
    }
    const sessionRegex = /^\d{4}-\d{2}$/;

    if (!sessionRegex.test(session)) {
        return next(new AppError("Invalid session format. Use YYYY-YY (e.g. 2026-27).", 400));
    }

    const existingAcademicYear =
        await AcademicYear.getAcademicYearBySession(
            session,
            schoolId
        );

    if (
        existingAcademicYear &&
        existingAcademicYear.id !== Number(id)
    ) {
        return next(
            new AppError(
                "Academic Year already exists for this school.",
                409
            )
        );
    }

    const updateAcademicYear = await AcademicYear.updateAcademicYear(id, schoolId, session, startDate, endDate)
    res.status(200).json({
        success: true,
        message: "Academic Year updated successfully",
        data: updateAcademicYear
    });
})

exports.activateAcademicYear = catchAsync(async (req, res,next) => {
    const { id } = req.params
    const schoolId = req.query.schoolId

    const getAcademicYears = await AcademicYear.getAcademicYearById(id, schoolId)

    if (!getAcademicYears) {
        return next(
            new AppError("Academic year not found.", 404)
        );
    }

    if (getAcademicYears.status === 'Active') {
        return next(new AppError("Academic Year is already active.",400))
    }
    if (getAcademicYears.status === "Closed") {
    return next(
        new AppError(
            "Closed Academic Year cannot be activated.",
            400
        )
    );
}


    const activateAcademicYear = await AcademicYear.activateAcademicYear(id, schoolId)
    return res.status(200).json({
        success: true,
        message: "Academic Year activated successfully.",
    })

})