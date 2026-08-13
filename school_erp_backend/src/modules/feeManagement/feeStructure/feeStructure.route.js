const express = require("express");
const router = express.Router();

const {validate }= require("../../../middlewares/validateMiddleware");
const {
    createFeeStructureSchema,
    updateFeeStructureSchema,
    updateFeeStructureStatusSchema
} = require("./feeStructure.validation");

const FeeStructureController = require("./feeStructure.controller");

router.post(
    "/",
    validate(createFeeStructureSchema),
    FeeStructureController.createFeeStructure
);

router.get(
    "/",
    FeeStructureController.getAllFeeStructures
);

router.get(
    "/:id",
    FeeStructureController.getFeeStructureById
);

router.put(
    "/:id",
    validate(updateFeeStructureSchema),
    FeeStructureController.updateFeeStructure
);

router.patch(
    "/:id/status",
    validate(updateFeeStructureStatusSchema),
    FeeStructureController.updateStatus
);

router.delete(
    "/:id",
    FeeStructureController.deleteFeeStructure
);

module.exports = router;