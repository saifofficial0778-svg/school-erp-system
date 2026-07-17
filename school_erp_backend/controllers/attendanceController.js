// school_erp_backend/controllers/attendanceController.js
const Attendance = require('../models/attendanceModel');

// 🟢 1. GET ALL ATTENDANCE LOGS FROM LIVE DB
exports.getAttendanceByDate = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
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
        // 🔑 Token se safe tarike se data nikala
        const schoolId = req.user.schoolId;
        const markedById = req.userId; // Kis teacher ne lagayi, tracking ke liye (Optional, par interview me kaam aayega)

        const { studentId, date, status, remarks } = req.body;

        // 🛡️ Safe-guard 1: Check mandatory fields (Yahan se schoolId hata diya kyunki wo body se nahi, token se aa raha hai)
        if (!studentId || !date || !status) {
            return res.status(400).json({
                success: false,
                message: "Bhai, studentId, date, aur status bharna mandatory hai!"
            });
        }

        const inputDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);

        if (inputDate > today) {
            return res.status(400).json({
                success: false,
                message: "Bhai chamatkar! Future date (aane wale kal) ki attendance aaj kaise laga sakte ho? ❌📅"
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

        // 🛡️ [INTERVIEW SPECIAL ADDITION]: Cross-School Student Data Leak Prevention
        // Tumhe SQL layer par ya yahan check karna chahiye ki kya studentId usi schoolId se belong karta hai?
        // Maan lete hain tumhari model me aisa query function hai:
        // const isOurStudent = await Student.verifySchool(parseInt(studentId), parseInt(schoolId));
        // if (!isOurStudent) return res.status(403).json({ message: "Bhai dusre school ke bache ki attendance kyu laga rhe ho?" });

        // 🎯 Save directly into the SQL Table
        const savedRecord = await Attendance.markSingle(
            parseInt(schoolId), // Token wala safe schoolId
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

        // 🛡️ Safe-guard 3: CATCH UNIQUE CONSTRAINT
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: "Bhaya, is student ki attendance aaj ki date me pehle se hi marked hai!"
            });
        }

        return res.status(500).json({ success: false, message: error.message });
    }
};

// 🔵 3. GET PIE CHART DATA FOR ANALYTICS
exports.getAttendancePieData = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const data = await Attendance.fetchAnalyticsForPie(schoolId);

        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error("Pie data error:", error.message);
        return res.status(500).json({ success: false, message: "Error!" });
    }
};

// 📊 4. GET MONTHLY ATTENDANCE INSIGHTS REPORT
exports.getAttendanceReport = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const rawRows = await Attendance.fetchMonthlyReport(schoolId);

        const studentMap = {};

        rawRows.forEach(row => {
            const sId = row.student_id;
            if (!sId) return;

            if (!studentMap[sId]) {
                studentMap[sId] = {
                    student_id: sId,
                    full_name: row.student_name || 'Unknown Student',
                    admission_number: row.admission_no || sId,
                    class_name: row.class_name || null,
                    section: row.section || null,
                    teacher_id: row.teacher_id || null,   // ✅ NEW: filter ke liye chahiye
                    total_classes: 0,
                    attended_classes: 0
                };
            }

            if (row.attendance_id) {
                studentMap[sId].total_classes += 1;
                if (row.log_status === 'present') {
                    studentMap[sId].attended_classes += 1;
                }
            }
        });

        let finalReportData = Object.values(studentMap);

        // ✅ NEW: agar Teacher hai, sirf apni assigned class ke students dikhao
        if (req.user.role === 'teacher') {
            const Teacher = require('../models/teacherModel');
            const teacherId = await Teacher.getTeacherIdByUserId(req.user.userId, schoolId);
            finalReportData = finalReportData.filter(s => s.teacher_id === teacherId);
        }

        // teacher_id field ko response se clean kar do (frontend ko iski zaroorat nahi)
        finalReportData = finalReportData.map(({ teacher_id, ...rest }) => rest);

        return res.status(200).json({
            success: true,
            count: finalReportData.length,
            data: finalReportData
        });

    } catch (error) {
        console.error("Critical Report Controller Crash Log:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }

};