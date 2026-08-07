const express = require("express");
const router = express.Router();

const TeacherController = require("./teacher.controller");

router.post('/',TeacherController.createTeacher)
router.get('/',TeacherController.getAllTeachers)
router.get('/:id',TeacherController.getTeacherById)
router.put('/:id',TeacherController.updateTeacher)
router.patch("/:id/status", TeacherController.updateStatus);
router.delete("/:id", TeacherController.deleteTeacher);


module.exports = router;