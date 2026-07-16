const express=require('express')
const router=express.Router();
const feeController=require('../controllers/feeController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/rbacMiddleware');

router.use(verifyToken,authorizeRoles('admin')); 
router.get('/',feeController.getAllFees);
router.post('/',feeController.addFee);
router.get('/report-page',feeController.getFeeReportPage)

module.exports=router;