const express=require('express')
const router=express.Router();
const academicYearController=require('../controllers/academicYearController');


router.post('/',academicYearController.createAcademicYear)
router.get('/',academicYearController.getAllAcademicYears)
router.get('/:id',academicYearController.getAcademicYearById)
router.put('/:id',academicYearController.updateAcademicYear)
router.patch('/:id/activate',academicYearController.activateAcademicYear)



module.exports=router;