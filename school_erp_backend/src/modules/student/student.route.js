const express = require("express");
const router = express.Router();
const validate=require('../../middlewares/validateMiddleware')
const { createStudentSchema } = require("./student.validation");

const StudentController = require("./student.controller");

router.post('/',validate(createStudentSchema),StudentController.createStudent)
router.get('/',StudentController.getAllStudents)
router.get('/:id',StudentController.getStudentById)
router.put('/:id',StudentController.updateStudent)
router.patch('/:id/status',StudentController.updateStatus)
router.delete('/:id',StudentController.deleteStudent)


module.exports = router;