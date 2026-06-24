const Student = require('../models/studentModel');

exports.getAllStudents = async (req, res) => {
    const schoolId = req.user.schoolId;
    try {
        const data = await Student.fetchAllBaseProfiles(schoolId);
        res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createStudent = async (req, res) => {
     const schoolId = req.user.schoolId;
    // ✅ password nahi chahiye - backend generate karega
    const { 
         email, fullName, admissionNumber, 
        rollNumber, whatsAppNumber, dateOfBirth, gender, guardianName 
    } = req.body;

    // ✅ password check hatao
    if (!email || !fullName || !admissionNumber || !rollNumber) {
        return res.status(400).json({ 
            success: false, 
            message: "Mandatory fields missing: schoolId, email, fullName, admissionNumber, rollNumber" 
        });
    }

    try {
        const result = await Student.createStudentTransaction(
            // ✅ password nahi bheja - model ka sequence match karo
            schoolId, email, fullName, admissionNumber,
            rollNumber, whatsAppNumber, dateOfBirth, gender, guardianName
        );

        res.status(201).json({ 
            success: true, 
            message: "Student enrolled successfully!",
            student: { id: result.id, fullName: result.fullName, rollNumber: result.rollNumber },
            credentials: result.credentials  // ✅ { email, password } frontend modal ke liye
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};