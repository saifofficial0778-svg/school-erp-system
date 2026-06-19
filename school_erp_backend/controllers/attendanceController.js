// school_erp_backend/controllers/attendanceController.js
const Attendance = require('../models/attendanceModel');

// 🟢 1. GET ALL ATTENDANCE LOGS FROM LIVE DB
exports.getAttendanceByDate = async (req, res) => {
    try {
        const schoolId = req.query.schoolId || 1; 
        const date = req.query.date || null;

        // DB function triggered
        const records = await Attendance.fetchByDate(schoolId, date);

        return res.status(200).json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        console.error("SQL Error in fetching attendance:", error.message);
        return res.status(500).json({ success: false, message: "Server database query crash hui bhai!" });
    }
};

// 🔴 2. MARK NEW ATTENDANCE WITH SQL DB CONSTRAINT HANDLING
exports.markAttendance = async (req, res) => {
    try {
        const { schoolId, studentId, date, status, remarks } = req.body;

        // 🛡️ Safe-guard 1: Check mandatory fields
        if (!schoolId || !studentId || !date || !status) {
            return res.status(400).json({ 
                success: false, 
                message: "Bhai, schoolId, studentId, date, aur status bharna mandatory hai!" 
            });
        }

        // 🛡️ Safe-guard 2: ENUM validation match
        const allowedStatus = ['present', 'absent', 'leave'];
        if (!allowedStatus.includes(status.toLowerCase())) {
            return res.status(400).json({ 
                success: false, 
                message: "Bhai, status sirf present, absent, ya leave ho sakta hai!" 
            });
        }

        // 🎯 Save directly into the SQL Table
        const savedRecord = await Attendance.markSingle(
            parseInt(schoolId),
            parseInt(studentId),
            date,
            status.toLowerCase(),
            remarks || null
        );

        return res.status(201).json({
            success: true,
            message: "Attendance successfully synchronized with Live DB! 🟢🚀",
            data: savedRecord
        });

    } catch (error) {
        console.error("Attendance POST fail:", error.message);

        // 🛡️ Safe-guard 3: CATCH UNIQUE CONSTRAINT (`unique_student_date`) FROM MYSQL DYNAMICALLY
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: "Bhaya, is student ki attendance aaj ki date me pehle se hi marked hai!"
            });
        }

        return res.status(500).json({ success: false, message: error.message });
    }
};