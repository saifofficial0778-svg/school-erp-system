// controllers/feeController.js
const Fee = require('../models/feeModel');

// 🟢 1. GET ALL FEES FROM DB (With Live Left Join Student Profiles)
exports.getAllFees = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { studentId } = req.query;

        // Agar specific single student ki history chahiye
        if (studentId) {
            const studentFees = await Fee.fetchByStudent(schoolId, studentId);
            return res.status(200).json({ success: true, data: studentFees });
        }

        // ✅ FIXED: Ab ye naye model ke sahi function (fetchAllWithStudents) ko hit karega
        const allFees = await Fee.fetchAllWithStudents(schoolId);
        
        return res.status(200).json({ 
            success: true, 
            count: allFees.length, 
            data: allFees 
        });
    } catch (error) {
        console.error("Fetch fees controller crash:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Database se live records list lane me gadbad hui!" 
        });
    }
};

// 🔴 2. NAYI FEE ADD KARNA (With Automatic Duplicate Key Updates)
exports.addFee = async (req, res) => {
    try {
        console.log("--> Received payload inside fee controller:", req.body);

        const { 
            schoolId, 
            studentId, 
            total_bill_amount, 
            amount_paid, 
            payment_mode, 
            status, 
            transaction_id 
        } = req.body;

        // Validation check strictly matching frontend keys
        if (!schoolId || !studentId || !amount_paid || !payment_mode || !status) {
            return res.status(400).json({ 
                success: false, 
                message: "Bhai, mandatory parameters (schoolId, studentId, amount_paid, payment_mode, status) missing hain!" 
            });
        }

        const paymentDate = new Date().toISOString().split('T')[0];

        // Trigger Model with full safety parse parameters
        const newFee = await Fee.recordPayment(
            parseInt(schoolId), 
            parseInt(studentId), 
            parseFloat(total_bill_amount || amount_paid), 
            parseFloat(amount_paid), 
            paymentDate, 
            payment_mode.toLowerCase(), 
            status.toLowerCase(), 
            transaction_id || `TXN_${Date.now()}`
        );

        return res.status(201).json({ 
            success: true, 
            message: "Fees chadh gayi boss SQL ledger me! 🎉💳", 
            data: newFee 
        });

    } catch (error) {
        console.error("POST Fee Controller Error:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: error.message || "DB me fee add karne me error aaya!" 
        });
    }
};

// 📊 3. GET PIE CHART DATA FOR ANALYTICS
exports.getFeePieChartData = async (req, res) => {
    try {
        const schoolId = req.query.schoolId || 1;
        const analyticsData = await Fee.fetchFeeStatusPieData(schoolId);

        return res.status(200).json({
            success: true,
            message: "Pie chart data ready!",
            data: analyticsData
        });
    } catch (error) {
        console.error("Pie data extraction failure:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Analytics nikalne me error!" 
        });
    }
};
exports.getFeeReportPage = async (req, res) => {
    try {
        const schoolId = req.query.schoolId || 1;
        const data = await Fee.fetchFeeReports(schoolId);

        return res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error("Fee Report Controller Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};