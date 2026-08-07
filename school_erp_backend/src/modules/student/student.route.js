const express = require("express");
const router = express.Router();

const StudentController = require("./student.controller");

router.post('/',StudentController.createStudent)
router.get('/',StudentController.getAllStudents)
router.get('/:id',StudentController.getStudentById)
router.put('/:id',StudentController.updateStudent)
router.patch('/:id/status',StudentController.updateStatus)
router.delete('/:id',StudentController.deleteStudent)


module.exports = router;