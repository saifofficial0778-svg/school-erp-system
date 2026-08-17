const express = require("express");
const router = express.Router();

const {validate} = require("../../../middlewares/validateMiddleware");

const {createStudentFeeAccountSchema,updateStudentFeeAccountStatusSchema} = require("./studentFeeAccount.validation");

const StudentFeeAccountController = require("./studentFeeAccount.controller");

router.post("/",validate(createStudentFeeAccountSchema),StudentFeeAccountController.createStudentFeeAccount);

router.get("/",StudentFeeAccountController.getAllStudentFeeAccounts);

router.get("/student/:studentId",StudentFeeAccountController.getStudentFeeAccountByStudentId);

router.get("/:id",StudentFeeAccountController.getStudentFeeAccountById);

router.patch("/:id/status",validate(updateStudentFeeAccountStatusSchema),StudentFeeAccountController.updateStatus);

router.delete("/:id",StudentFeeAccountController.deleteStudentFeeAccount);

module.exports = router