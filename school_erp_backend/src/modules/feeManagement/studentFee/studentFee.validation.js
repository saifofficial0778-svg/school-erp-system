const { z } = require("zod");

const createStudentFeeSchema = z.object({
    studentId: z
        .number()
        .int()
        .positive(),

    feeStructureId: z
        .number()
        .int()
        .positive()
});

const updateStudentFeeStatusSchema = z.object({
    status: z.enum([
        "Pending",
        "Partial",
        "Paid"
    ])
});

module.exports = {
    createStudentFeeSchema,
    updateStudentFeeStatusSchema
};