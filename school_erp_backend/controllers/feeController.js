const Fee = require('../models/feeModel');

exports.getAllFees = async (req, res) => {
    try {
        const schoolId = req.user.schoolId; // ✅ JWT se
        const { studentId } = req.query;

        if (studentId) {
           const studentFees = await Fee.fetchStudentFeeDetails(schoolId, studentId);
            return res.status(200).json({ success: true, data: studentFees });
        }

        const allFees = await Fee.fetchAllWithStudents(schoolId);
        return res.status(200).json({ success: true, count: allFees.length, data: allFees });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.addFee = async (req, res) => {
    try {
        const schoolId = req.user.schoolId; // ✅ JWT se - body se nahi

        const {
            studentId, amount_paid,
            payment_mode, transaction_id
        } = req.body; // ✅ schoolId hataya

        if (!studentId || !amount_paid || !payment_mode) { // ✅ schoolId check hataya
            return res.status(400).json({
                success: false,
                message: "Mandatory parameters missing: studentId, amount_paid, payment_mode, status"
            });
        }

        if (!schoolId) {
            return res.status(401).json({
                success: false,
                message: "School ID missing from token. Dobara login karo."
            });
        }



        const newFee = await Fee.recordPayment(
            parseInt(schoolId),
            parseInt(studentId),
            parseFloat(amount_paid),
            payment_mode.toLowerCase(),
            transaction_id || `TXN_${Date.now()}`,
            req.body.remarks || null
        );

        return res.status(201).json({ success: true, message: "Fee recorded!", data: newFee });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFeePieChartData = async (req, res) => {
    try {
        const schoolId = req.user.schoolId; // ✅ JWT se
        const analyticsData = await Fee.fetchFeeStatusPieData(schoolId);
        return res.status(200).json({ success: true, data: analyticsData });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFeeReportPage = async (req, res) => {
    try {
        const schoolId = req.user.schoolId; // ✅ JWT se
        const data = await Fee.fetchFeeReports(schoolId);
        return res.status(200).json({ success: true, count: data.length, data: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};