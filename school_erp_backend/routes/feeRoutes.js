const express=require('express')
const router=express.Router();
const feeController=require('../controllers/feeController');

router.get('/',feeController.getAllFees);
router.post('/',feeController.addFee);

module.exports=router;