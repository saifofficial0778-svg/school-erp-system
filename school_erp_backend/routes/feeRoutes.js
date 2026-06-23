const express=require('express')
const router=express.Router();
const feeController=require('../controllers/feeController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/',verifyToken,feeController.getAllFees);
router.post('/',verifyToken,feeController.addFee);
router.get('/report-page',verifyToken,feeController.getFeeReportPage)

module.exports=router;