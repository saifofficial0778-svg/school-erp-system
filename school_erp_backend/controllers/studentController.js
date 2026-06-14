const students = require('../models/studentModel');

exports.getAllStudents = (req, res) => {
    res.status(200).json({ success: true, count: students.length, data: students });
};

exports.createStudent = (req, res) => {
    const { name, class: studentClass, rollNo } = req.body;
    if (!name || !studentClass || !rollNo) {
        return res.status(400).json({ success: false, message: "Bhai, saari fields daalna zaroori hai!" });
    }
    const newStudent = { id: students.length + 1, name, class: studentClass, rollNo };
    students.push(newStudent);
    res.status(201).json({ success: true, message: "Student successfully add ho gaya!", data: newStudent });
};