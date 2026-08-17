const { z } = require("zod");

const createStudentFeeAccountSchema = z.object({
    studentId: z
        .number()
        .int()
        .positive(),

    academicYearId: z
        .number()
        .int()
        .positive()
});

const updateStudentFeeAccountStatusSchema = z.object({
    status: z.enum([
        "Pending",
        "Partial",
        "Paid"
    ])
});

module.exports = {
    createStudentFeeAccountSchema,
    updateStudentFeeAccountStatusSchema
};