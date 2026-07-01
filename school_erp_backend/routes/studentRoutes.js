const express=require('express');
const router=express.Router();
const studentController=require('../controllers/studentController')
const verifyToken = require('../middlewares/authMiddleware');

router.get('/',verifyToken,studentController.getAllStudents);
router.post('/',verifyToken,studentController.createStudent);
router.put('/',verifyToken,studentController.updateStudent);
router.delete('/',verifyToken,studentController.deleteStudent)

module.exports=router;