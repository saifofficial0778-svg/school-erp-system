const express = require("express");
const router = express.Router();

const {validate} = require("../../../middlewares/validateMiddleware");
const {createStudentFeeSchema,updateStudentFeeStatusSchema} = require("./studentFee.validation");

const StudentFeeController = require("./studentFee.controller");

router.post("/",validate(createStudentFeeSchema),StudentFeeController.createStudentFee);

router.get("/",StudentFeeController.getAllStudentFees);

router.get("/student/:studentId",StudentFeeController.getStudentFeesByStudentId);

router.get("/:id",StudentFeeController.getStudentFeeById);

router.patch("/:id/status",validate(updateStudentFeeStatusSchema),StudentFeeController.updateStatus);

router.delete("/:id",StudentFeeController.deleteStudentFee);

module.exports = router;