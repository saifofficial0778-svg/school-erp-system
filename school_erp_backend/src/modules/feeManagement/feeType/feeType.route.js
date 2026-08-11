const express = require("express");
const router = express.Router();
const validate=require('../../../middlewares/validateMiddleware')
const {createFeeTypeSchema,updateFeeTypeSchema,updateFeeTypeStatusSchema}=require('./feeType.validation')

const FeeTypeController = require("./feeType.controller");

router.post("/",validate(createFeeTypeSchema), FeeTypeController.createFeeType);
router.get("/", FeeTypeController.getAllFeeTypes);
router.get("/:id", FeeTypeController.getFeeTypeById);
router.put("/:id", validate(updateFeeTypeSchema),FeeTypeController.updateFeeType);
router.patch("/:id/status",validate(updateFeeTypeStatusSchema), FeeTypeController.updateStatus);
router.delete("/:id", FeeTypeController.deleteFeeType);

module.exports = router;