const feesRecords = require('../models/feeModel');
const students = require('../models/studentModel'); // Import kiya taaki student check kar sakein

exports.getAllFees = (req, res) => {
    const { studentId } = req.query;
    if (studentId) {
        const studentFees = feesRecords.filter(f => f.studentId === parseInt(studentId));
        return res.status(200).json({ success: true, data: studentFees });
    }
    res.status(200).json({ success: true, count: feesRecords.length, data: feesRecords });
};

exports.addFee = (req, res) => {
    const { studentId, amountPaid, feeType, status } = req.body;

    if (!studentId || !amountPaid || !feeType || !status) {
        return res.status(400).json({ success: false, message: "Bhai, fees ki saari details bharo!" });
    }

    // 🎯 Sahi check: actual students array me id dhoondo!
    const studentExists = students.some(s => s.id === parseInt(studentId));
    if (!studentExists) {
        return res.status(404).json({ success: false, message: "Bhaya, is ID ka koi student hi nahi hai system me." });
    }

    const newFee = {
        feeId: feesRecords.length + 101,
        studentId: parseInt(studentId),
        amountPaid: parseFloat(amountPaid),
        feeType,
        status,
        date: new Date().toISOString().split('T')[0] // Sahi bracket ke sath ()
    };

    feesRecords.push(newFee);
    res.status(201).json({ success: true, message: "Fees chadh gayi boss!", data: newFee });
};