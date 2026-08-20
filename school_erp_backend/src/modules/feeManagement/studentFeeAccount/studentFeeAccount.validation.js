const { z } = require("zod");

const createStudentFeeAccountSchema = z.object({
    studentId: z
        .number()
        .int()
        .positive(),

    academicYearId: z
        .number()
        .int()
        .positive(),

   installmentPlan: z.enum([
    "Monthly",
    "Quarterly",
    "Half-Yearly",
    "One-Time"
]),

startDate: z
    .string()
    .date("Invalid date")

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