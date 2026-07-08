const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController')
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', verifyToken, teacherController.getAllTeachers);
router.get('/:teacherId', verifyToken, teacherController.getTeacherById);
router.get('/:teacherId/profile-view', verifyToken, teacherController.getTeacherCompleteProfile);
router.post('/', verifyToken, teacherController.createTeacher);
router.put('/:teacherId', verifyToken, teacherController.updateTeacher);
router.delete('/:teacherId', verifyToken, teacherController.deleteTeacher)

module.exports = router;