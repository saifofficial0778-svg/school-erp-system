const express=require('express')
const router=express.Router();
const academicYearController=require('../controllers/academicYearController');


router.post('/',academicYearController.createAcademicYear)

module.exports=router;