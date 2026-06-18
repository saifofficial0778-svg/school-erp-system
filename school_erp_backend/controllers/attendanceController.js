// school_erp_backend/controllers/attendanceController.js

const attendanceRecords = require('../models/attendanceModel');
const students = require('../models/studentModel'); // Future check ke liye agar student list array ready ho

// 🟢 1. GET ALL ATTENDANCE LOGS (Filter by Date & School)
exports.getAttendanceByDate = (req, res) => {
    try {
        const { date, school_id } = req.query;

        // Agar query me date aayi hai, toh filter karo, nahi toh poora data bhej do
        let filteredRecords = attendanceRecords;

        if (date) {
            filteredRecords = filteredRecords.filter(rec => rec.date === date);
        }

        if (school_id) {
            filteredRecords = filteredRecords.filter(rec => rec.school_id === parseInt(school_id));
        }

        return res.status(200).json({
            success: true,
            count: filteredRecords.length,
            data: filteredRecords
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server par gadbad hui bhai!" });
    }
};

// 🔴 2. MARK NEW ATTENDANCE (POST Request with DB Constraint checks)
exports.markAttendance = (req, res) => {
    try {
        const { school_id, student_id, date, status, remarks } = req.body;

        // 🛡️ Safe-guard 1: Check mandatory fields
        if (!school_id || !student_id || !date || !status) {
            return res.status(400).json({ 
                success: false, 
                message: "Bhai, school_id, student_id, date, aur status bharna mandatory hai!" 
            });
        }

        // 🛡️ Safe-guard 2: ENUM validation match ('present', 'absent', 'leave')
        const allowedStatus = ['present', 'absent', 'leave'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "Bhai, status sirf present, absent, ya leave ho sakta hai!" 
            });
        }

        // 🛡️ Safe-guard 3: UNIQUE CONSTRAINT CHECK (unique_student_date)
        // Ek student ki same date par dobara entry nahi honi chahiye
        const isAlreadyMarked = attendanceRecords.some(
            rec => rec.student_id === parseInt(student_id) && rec.date === date
        );

        if (isAlreadyMarked) {
            return res.status(400).json({ 
                success: false, 
                message: "Bhaya, is student ki attendance aaj ki date me pehle se hi marked hai!" 
            });
        }

        // 🎯 Create New Attendance Object
        const newAttendance = {
            id: attendanceRecords.length + 1,
            school_id: parseInt(school_id),
            student_id: parseInt(student_id),
            date: date,
            status: status,
            remarks: remarks || null
        };

        // Push inside fake db array
        attendanceRecords.push(newAttendance);

        return res.status(201).json({
            success: true,
            message: "Attendance successfully synchronized! 🟢🚀",
            data: newAttendance
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Post request fail ho gayi server par!" });
    }
};