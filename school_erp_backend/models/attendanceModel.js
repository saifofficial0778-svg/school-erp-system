// school_erp_backend/models/attendanceModel.js

// 📝 Initial dummy logs jo SQL schema columns ke keys se exact match hain
let attendanceRecords = [
    {
        id: 1,
        school_id: 1,
        student_id: 1, // Student ID 1 ki attendance
        date: "2026-06-18",
        status: "present", // ENUM: 'present', 'absent', 'leave'
        remarks: "Timed arrival"
    },
    {
        id: 2,
        school_id: 1,
        student_id: 2, // Student ID 2 ki attendance
        date: "2026-06-18",
        status: "absent",
        remarks: "Uninformed absence"
    }
];

module.exports = attendanceRecords;