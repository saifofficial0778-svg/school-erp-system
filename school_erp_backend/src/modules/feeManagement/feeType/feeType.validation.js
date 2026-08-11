const { z } = require('zod')

const createFeeTypeSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Fee type name must be at least 2 characters")
        .max(100, "Fee type name must not exceed 100 characters"),

    description: z
        .string()
        .trim()
        .max(255, "Description must not exceed 255 characters")
        .optional()
})

const updateFeeTypeSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Fee type name must be at least 2 characters")
        .max(100, "Fee type name must not exceed 100 characters"),

    description: z
        .string()
        .trim()
        .max(255, "Description must not exceed 255 characters")
        .optional()
});

const updateFeeTypeStatusSchema = z.object({
    status: z.enum(["Active", "Inactive"])
});

module.exports = {
    createFeeTypeSchema,
    updateFeeTypeSchema,
    updateFeeTypeStatusSchema
};