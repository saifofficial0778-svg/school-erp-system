const Teacher = require('../models/teacherModel');

exports.addTeacher = async (req, res) => {
    try {
        const {
            email, full_name, phone, qualification, specialization,
            experience_years, previous_school, joining_date, bank_name, account_number, ifsc_code, salary
        } = req.body;

        // 👑 Security context verification check (extracted from authMiddleware token layer)
        const school_id = req.user.schoolId; 

        // Airtight validations
        if (!email || !full_name || !qualification || !salary) {
            return res.status(400).json({ success: false, message: "Bhai, essential inputs khali mat chodo!" });
        }

        // Execute transaction routine block straight inside database cluster
        const newTeacherData = await Teacher.createTeacherTransaction(
            school_id, email, full_name, phone, qualification, specialization,
            experience_years, previous_school, joining_date, bank_name, account_number, ifsc_code, salary
        );

        return res.status(201).json({
            success: true,
            message: "Teacher profile aur portal account dono tables me successfully secure ho gae! 🧑‍🏫🚀",
            data: newTeacherData // Includes the plain text password key-value block for modal popup
        });

    } catch (error) {
        console.error("Teacher Subsystem Processing Error:", error);
        
        // Handle constraint duplicate anomalies
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: "Bhai, yeh email ya identity parameters pehle se use me hain!" });
        }
        
        return res.status(500).json({ success: false, message: "Internal architecture runtime error in registration pipeline!" });
    }
};