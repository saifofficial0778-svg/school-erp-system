const express=require('express');
const router=express.Router();
const studentController=require('../controllers/studentController')
const verifyToken = require('../middlewares/authMiddleware');

router.get('/',verifyToken,studentController.getAllStudents);
router.get('/:studentId', verifyToken, studentController.getStudentById);
router.get('/:studentId/profile-view', verifyToken, studentController.getStudentCompleteProfile);
router.post('/',verifyToken,studentController.createStudent);
router.put('/:studentId',verifyToken,studentController.updateStudent);
router.delete('/:studentId',verifyToken,studentController.deleteStudent)

module.exports=router;