const { z } = require("zod");

const createStudentSchema = z.object({

    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name is too long"),

    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    phone: z
        .string()
        .regex(
            /^[6-9]\d{9}$/,
            "Invalid Indian mobile number"
        ),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password is too long"),
        
    admissionNumber: z
        .string()
        .trim()
        .min(1, "Admission number is required")
        .max(50, "Admission number is too long"),

    admissionDate: z
        .string()
        .min(1, "Admission date is required"),

    fatherName: z
        .string()
        .trim()
        .min(2, "Father name must be at least 2 characters")
        .max(100, "Father name is too long"),

    motherName: z
        .string()
        .trim()
        .min(2, "Mother name must be at least 2 characters")
        .max(100, "Mother name is too long"),

    guardianName: z
        .string()
        .trim()
        .min(2, "Guardian name must be at least 2 characters")
        .max(100, "Guardian name is too long")
        .optional(),

    guardianPhone: z
        .string()
        .regex(
            /^[6-9]\d{9}$/,
            "Invalid Indian mobile number"
        )
        .optional(),

   gender: z.enum(["Male", "Female", "Other"]),

    dateOfBirth: z
        .string()
        .min(1, "Date of birth is required"),

    address: z
        .string()
        .trim()
        .min(5, "Address is too short")
        .max(500, "Address is too long"),

    aadhaarNumber: z
        .string()
        .regex(
            /^\d{12}$/,
            "Aadhaar number must be exactly 12 digits"
        )
        .optional(),

    photo: z
        .string()
        .optional()
});


module.exports = {
    createStudentSchema
};