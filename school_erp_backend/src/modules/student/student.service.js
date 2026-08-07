const bcrypt = require("bcrypt");
const pool = require("../../config/db");
const SchoolModel = require("../school/school.repository");
const StudentModel = require("./student.repository");
const AppError = require("../../utils/appError");

const StudentService = {

    async createStudent(schoolId, studentData) {
        const school = await SchoolModel.getSchoolProfile(schoolId);

        if (!school) {
            throw new AppError("School not found", 404);
        }

        if (school.status !== "Active") {
            throw new AppError("School is not active", 403);
        }
        const requiredFields = [
            "fullName",
            "email",
            "phone",
            "password",

            "admissionNumber",
            "admissionDate",

            "fatherName",

            "guardianPhone",
            "gender",
            "dateOfBirth",
            "address"
        ];
        for (const field of requiredFields) {
            if (!studentData[field]) {
                throw new AppError(`${field} is require`, 400)
            }
        }

        const {
            fullName,
            email,
            phone,
            password,

            admissionNumber,
            admissionDate,

            fatherName,
            motherName,

            guardianName,
            guardianPhone,

            gender,
            dateOfBirth,

            address,

            aadhaarNumber,
            photo

        } = studentData;

        const existingEmail = await StudentModel.findUserByEmail(email, schoolId);

        if (existingEmail) {
            throw new AppError("Email already exists.", 409);
        }

        const existingPhone = await StudentModel.findUserByPhone(phone, schoolId);

        if (existingPhone) {
            throw new AppError("Phone number already exists.", 409);
        }

        const existingAdmissionNumber = await StudentModel.findStudentByAdmissionNumber(admissionNumber, schoolId);

        if (existingAdmissionNumber) {
            throw new AppError("Admission number already exists.", 409);
        }

        if (aadhaarNumber) {
            const existingAadhaar = await StudentModel.findStudentByAadhaar(
                aadhaarNumber,
                schoolId
            );

            if (existingAadhaar) {
                throw new AppError("Aadhaar number already exists.", 409);
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            schoolId,
            fullName,
            email,
            phone,
            password: hashedPassword,
            role: "Student"
        };
        const studentProfileData = {
            schoolId,
            admissionNumber,
            admissionDate,
            fatherName,
            motherName,
            guardianName,
            guardianPhone,
            gender,
            dateOfBirth,
            address,
            aadhaarNumber,
            photo
        };

        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            const userId = await StudentModel.createUser(connection, userData)

            studentProfileData.userId = userId

            const studentId = await StudentModel.createStudent(connection, studentProfileData)

            await connection.commit()
            return {
                userId,
                studentId
            };
        } catch (error) {
            await connection.rollback()
            throw error
        } finally {
            connection.release()
        }
    },

    async getAllStudents(schoolId) {
        const school = await SchoolModel.getSchoolProfile(schoolId);

        if (!school) {
            throw new AppError("School not found", 404);
        }

        if (school.status !== "Active") {
            throw new AppError("School is not active", 403);
        }
        const students = await StudentModel.getAllStudents(schoolId)
        return students
    },

    async getStudentById(id, schoolId) {
        const school = await SchoolModel.getSchoolProfile(schoolId);

        if (!school) {
            throw new AppError("School not found", 404);
        }

        if (school.status !== "Active") {
            throw new AppError("School is not active", 403);
        }
        const student = await StudentModel.getStudentById(id, schoolId)
        if (!student) {
            throw new AppError("Student not found", 404);
        }
        return student
    },

    async updateStudent(id, schoolId, studentData) {
        const school = await SchoolModel.getSchoolProfile(schoolId);

        if (!school) {
            throw new AppError("School not found", 404);
        }

        if (school.status !== "Active") {
            throw new AppError("School is not active", 403);
        }

        const student = await StudentModel.getStudentById(id, schoolId)
        if (!student) {
            throw new AppError("Student not found", 404);
        }
        const requiredFields = [
            "fullName",
            "email",
            "phone",
            "fatherName",

            "guardianPhone",
            "gender",
            "dateOfBirth",
            "address"
        ]
        for (const field of requiredFields) {
            if (!studentData[field]) {
                throw new AppError(`${field} is require`, 400)
            }
        }
        const {
            fullName,
            email,
            phone,
            fatherName,
            motherName,

            guardianName,
            guardianPhone,

            gender,
            dateOfBirth,

            address,

            aadhaarNumber,
            photo

        } = studentData;

        const existingEmail = await StudentModel.findUserByEmailForUpdate(
            email,
            schoolId,
            student.user_id
        );

        if (existingEmail) {
            throw new AppError("Email already exists.", 409);
        }


        const existingPhone = await StudentModel.findUserByPhoneForUpdate(
            phone,
            schoolId,
            student.user_id
        );

        if (existingPhone) {
            throw new AppError("Phone number already exists.", 409);
        }

        if (aadhaarNumber) {

            const existingAadhaar =
                await StudentModel.findStudentByAadhaarForUpdate(
                    aadhaarNumber,
                    schoolId,
                    id
                );

            if (existingAadhaar) {
                throw new AppError("Aadhaar number already exists.", 409);
            }

        }

        const userData = {
            fullName,
            email,
            phone
        };

        const studentProfileData = {
            schoolId,
            fatherName,
            motherName,
            guardianName,
            guardianPhone,
            gender,
            dateOfBirth,
            address,
            aadhaarNumber,
            photo
        };

        const connection=await pool.getConnection()
        try{
            await connection.beginTransaction()

            await StudentModel.updateUser(connection,student.user_id,userData)
            await StudentModel.updateStudent(connection,id,studentProfileData)

            await connection.commit()

            
        }catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();

        }
        return await StudentModel.getStudentById(id,schoolId)


    },

    async updateStatus(id, schoolId, status) {
        const school = await SchoolModel.getSchoolProfile(schoolId);

        if (!school) {
            throw new AppError("School not found", 404);
        }

        if (school.status !== "Active") {
            throw new AppError("School is not active", 403);
        }
        const student = await StudentModel.getStudentById(id, schoolId)
        if (!student) {
            throw new AppError("Student not found", 404);
        }

        const result=await StudentModel.updateStatus(student.user_id,schoolId,status)
        return result
    },

    async deleteStudent(id, schoolId) {
        const school = await SchoolModel.getSchoolProfile(schoolId);

        if (!school) {
            throw new AppError("School not found", 404);
        }

        if (school.status !== "Active") {
            throw new AppError("School is not active", 403);
        }

        const student = await StudentModel.getStudentById(id, schoolId)
        if (!student) {
            throw new AppError("Student not found", 404);
        }

        const connection=await pool.getConnection()
        try{
            await connection.beginTransaction()

            await StudentModel.deleteUser(connection,student.user_id)
            await StudentModel.deleteStudent(connection,id)
            await connection.commit()
            return true;
        }catch(error){
            await connection.rollback()
            throw error
        }finally{
             connection.release()
        }
        

    }

};

module.exports = StudentService;