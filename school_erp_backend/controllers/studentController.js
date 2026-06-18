const Student = require('../models/studentModel');

// 1. GET ALL STUDENTS (Unassigned + Assigned Dono Ke Liye - Profile Only)
exports.getAllStudents = async (req, res) => {
    const schoolId = req.query.schoolId || 1; 

    try {
        // 🎯 Note: Yahan base profiles uthane ke liye direct method chalao (Bina class join ke)
        // Agar model me sirf base query hai toh use call karo, nahi toh model me chota badlav karenge
        const data = await Student.fetchAllBaseProfiles(schoolId); 
        
        res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. CREATE STUDENT (Pure Core Profile Only)
exports.createStudent = async (req, res) => {
    const { schoolId, email, password, fullName, rollNumber, guardianName } = req.body;

    // Strict Validation
    if (!schoolId || !email || !password || !fullName || !rollNumber) {
        return res.status(400).json({ 
            success: false, 
            message: "Bhai, saari fields daalna zaroori hai!" 
        });
    }

    try {
        const passwordHash = password; 

        // 🚀 Model ko vahi data bheja jo frontend se aaya hai
        const newStudent = await Student.createStudentTransaction(
            schoolId, email, passwordHash, fullName, rollNumber, guardianName
        );

        res.status(201).json({
            success: true,
            message: "Student profile registered successfully! Class mapping independent hai ab. 🎓",
            data: newStudent
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};