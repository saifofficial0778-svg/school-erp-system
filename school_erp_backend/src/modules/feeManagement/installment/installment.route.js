const express = require("express");
const router = express.Router();

const InstallmentController = require("./installment.controller");

router.get("/",InstallmentController.getAllInstallments);

router.get("/account/:studentFeeAccountId",InstallmentController.getInstallmentsByStudentFeeAccountId);

router.get("/:id",InstallmentController.getInstallmentById);

module.exports = router;