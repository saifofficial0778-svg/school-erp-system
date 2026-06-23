const ClassModel = require('../models/classModel');

exports.getAllClasses = async (req, res) => {
    try {
        const schoolId = req.user.schoolId ;
        const data = await ClassModel.fetchAllClasses(schoolId);
        
        return res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};