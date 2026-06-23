const express=require('express')
const router=express.Router();
const attendanceController=require('../controllers/attendanceController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/',verifyToken,attendanceController.getAttendanceByDate);
router.post('/',verifyToken,attendanceController.markAttendance);
// routes/attendanceRoutes.js me baaki routes ke sath add karo:
router.get('/report',verifyToken, attendanceController.getAttendanceReport);

module.exports=router;