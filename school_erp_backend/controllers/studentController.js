const Student = require('../models/studentModel');
const catchAsync=require('../utils/catchAsync')
const AppError=require('../utils/AppError')


exports.getAllStudents =  catchAsync(async(req, res) => {
    const schoolId = req.user.schoolId;
    
        const data = await Student.fetchAllBaseProfiles(schoolId);
        res.status(200).json({ success: true, count: data.length, data });
   
});

exports.createStudent =  catchAsync( async (req, res) => {
     const schoolId = req.user.schoolId;
    // ✅ password nahi chahiye - backend generate karega
    const { 
         email, fullName, admissionNumber, 
        rollNumber, whatsAppNumber, dateOfBirth, gender, guardianName 
    } = req.body;

    // ✅ password check hatao
    if (!email || !fullName || !admissionNumber || !rollNumber) {
        return next(new AppError("Mandatory fields missing: email, fullName, admissionNumber, rollNumber", 400));
    }

    
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

    
});

exports.updateStudent=catchAsync(async(req,res,next)=>{
    const {studentId}=req.params;

    const{email, fullName, rollNumber, whatsAppNumber, 
        dateOfBirth, gender, guardianName 
    } = req.body;

    if (!email || !fullName || !rollNumber) {
        return next(new AppError("Bhai, Email, Full Name aur Roll Number bharna mandatory hai!", 400));
    }

    const result=await Student.updateStudentTransaction(studentId, email, fullName, rollNumber, whatsAppNumber, dateOfBirth, gender, guardianName
    );

    res.status(200).json({
        success: true,
        message: result.message || "Student profile updated successfully!",
        data: {
            studentId,
            fullName,
            email
        }
    });
});

exports.deleteStudent=catchAsync(async(req,res,next)=>{
    const {studentId}=req.params
    const schoolId=req.user.schoolId

    const result =await Student.deleteStudentTransaction(schoolId,studentId);

    res.status(200).json({
        success: true,
        message: result.message
    });
})