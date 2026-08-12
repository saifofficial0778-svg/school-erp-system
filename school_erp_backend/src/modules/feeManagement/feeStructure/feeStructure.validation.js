const { z } = require("zod");

const createFeeStructureSchema = z.object({
    academicYearId: z
        .number()
        .int()
        .positive(),

    classId: z
        .number()
        .int()
        .positive(),

    feeTypeId: z
        .number()
        .int()
        .positive(),

    amount: z
        .number()
        .positive(),

    frequency: z.enum([
        "Monthly",
        "Quarterly",
        "Half-Yearly",
        "Yearly"
    ])
});

const updateFeeStructureSchema = createFeeStructureSchema;
const updateFeeStructureStatusSchema = z.object({
    status: z.enum(["Active", "Inactive"])
});

module.exports = {
    createFeeStructureSchema,
    updateFeeStructureSchema,
    updateFeeStructureStatusSchema
};