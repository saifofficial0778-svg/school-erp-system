const express=require('express')
const router=express.Router();
const attendanceController=require('../controllers/attendanceController')

router.get('/',attendanceController.getAttendanceByDate);
router.post('/',attendanceController.markAttendance);
// routes/attendanceRoutes.js me baaki routes ke sath add karo:
router.get('/report', attendanceController.getAttendanceReport);

module.exports=router;