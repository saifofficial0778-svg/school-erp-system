const Student = require('../models/studentModel');

exports.getAllStudents = async (req, res) => {
    const schoolId = req.user.schoolId; 
    try {
        const data = await Student.fetchAllBaseProfiles(schoolId); 
        res.status(200).json({ success: true, count: data.length, data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createStudent = async (req, res) => {
    const { schoolId, email, password, fullName, admissionNumber, rollNumber, whatsAppNumber, dateOfBirth, gender, guardianName } = req.body;

    if (!schoolId || !email || !password || !fullName || !admissionNumber || !rollNumber) {
        return res.status(400).json({ success: false, message: "Bhai, mandatory keys missing hain payload me!" });
    }

    try {
        const newStudent = await Student.createStudentTransaction(
            schoolId, email, password, fullName, admissionNumber, rollNumber, whatsAppNumber, dateOfBirth, gender, guardianName
        );
        res.status(201).json({ success: true, message: "Student Profile created!", data: newStudent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};