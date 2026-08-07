const pool = require("../../config/db");
const TeacherModel = require("./teacher.repository");
const SchoolModel = require("../school/school.repository");
const AppError = require("../../utils/appError");
const bcrypt = require("bcrypt");

const TeacherService = {

    async createTeacher(schoolId, teacherData) {

        
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
            "qualification",
            "joiningDate",
            "salary",
            "gender",
            "dateOfBirth",
            "address"
        ];

        for (const field of requiredFields) {
            if (!teacherData[field]) {
                throw new AppError(`${field} is required.`, 400);
            }
        }

        // 3. Destructure Data
        const {
            fullName,
            email,
            phone,
            password,
            employeeCode,
            qualification,
            experienceYears,
            joiningDate,
            salary,
            gender,
            dateOfBirth,
            address,
            aadhaarNumber,
            photo
        } = teacherData;

       
        const existingEmail = await TeacherModel.findUserByEmail(email, schoolId);

        if (existingEmail) {
            throw new AppError("Email already exists.", 409);
        }

        const existingPhone = await TeacherModel.findUserByPhone(phone, schoolId);

        if (existingPhone) {
            throw new AppError("Phone number already exists.", 409);
        }

        if (aadhaarNumber) {
            const existingAadhaar = await TeacherModel.findTeacherByAadhaar(
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
            role: "Teacher"
        };

        const teacherProfileData = {
            schoolId,
            employeeCode,
            qualification,
            experienceYears,
            joiningDate,
            salary,
            gender,
            dateOfBirth,
            address,
            aadhaarNumber,
            photo
        };

      
        const connection = await pool.getConnection();

        try {

            await connection.beginTransaction();

            // Create User
            const userId = await TeacherModel.createUser(
                connection,
                userData
            );

           
            teacherProfileData.userId = userId;

            const teacherId = await TeacherModel.createTeacher(
                connection,
                teacherProfileData
            );


            await connection.commit();

            return {
                userId,
                teacherId
            };

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();

        }

    },

    async getAllTeachers(schoolId) {
        const school = await SchoolModel.getSchoolProfile(schoolId);

        if (!school) {
            throw new AppError("School not found", 404);
        }

        if (school.status !== "Active") {
            throw new AppError("School is not active", 403);
        }

        const teachers = await TeacherModel.getAllTeachers(schoolId)
        return teachers
    },

    async getTeacherById(id, schoolId) {
        const school = await SchoolModel.getSchoolProfile(schoolId);

        if (!school) {
            throw new AppError("School not found", 404);
        }

        if (school.status !== "Active") {
            throw new AppError("School is not active", 403);
        }

        const teacher = await TeacherModel.getTeacherById(id, schoolId)
        if (!teacher) {
            throw new AppError("Teacher not found", 404);
        }
        return teacher
    },

    async updateTeacher(id, schoolId, teacherData) {

        // 1. Check School
        const school = await SchoolModel.getSchoolProfile(schoolId);

        if (!school) {
            throw new AppError("School not found", 404);
        }

        if (school.status !== "Active") {
            throw new AppError("School is not active", 403);
        }

     
        const teacher = await TeacherModel.getTeacherById(id, schoolId);

        if (!teacher) {
            throw new AppError("Teacher not found", 404);
        }

        // 3. Required Fields (PUT)
        const requiredFields = [
            "fullName",
            "email",
            "phone",
            "qualification",
            "joiningDate",
            "salary",
            "gender",
            "dateOfBirth",
            "address"
        ];

        for (const field of requiredFields) {
            if (
                teacherData[field] === undefined ||
                teacherData[field] === null ||
                teacherData[field] === ""
            ) {
                throw new AppError(`${field} is required.`, 400);
            }
        }

        // 3. Destructure Data
        const {
            fullName,
            email,
            phone,
            qualification,
            experienceYears,
            joiningDate,
            salary,
            gender,
            dateOfBirth,
            address,
            aadhaarNumber,
            photo
        } = teacherData;

       
        const existingEmail = await TeacherModel.findUserByEmailForUpdate(
            email,
            schoolId,
            teacher.user_id
        );

        if (existingEmail) {
            throw new AppError("Email already exists.", 409);
        }

        
        const existingPhone = await TeacherModel.findUserByPhoneForUpdate(
            phone,
            schoolId,
            teacher.user_id
        );

        if (existingPhone) {
            throw new AppError("Phone number already exists.", 409);
        }


        
        if (aadhaarNumber) {

            const existingAadhaar =
                await TeacherModel.findTeacherByAadhaarForUpdate(
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

        const teacherProfileData = {
            schoolId,
            qualification,
            experienceYears,
            joiningDate,
            salary,
            gender,
            dateOfBirth,
            address,
            aadhaarNumber,
            photo
        };

    
        const connection = await pool.getConnection();

        try {

            await connection.beginTransaction();

            
            await TeacherModel.updateUser(
                connection,
                teacher.user_id,
                userData
            );

        
            await TeacherModel.updateTeacher(
                connection,
                id,
                teacherProfileData
            );

            await connection.commit();


        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();

        }

        
        return await TeacherModel.getTeacherById(id, schoolId);
    },

    async updateStatus(id, schoolId, status) {
        const school = await SchoolModel.getSchoolProfile(schoolId);

        if (!school) {
            throw new AppError("School not found", 404);
        }

        if (school.status !== "Active") {
            throw new AppError("School is not active", 403);
        }

        // 2. Check Teacher Exists
        const teacher = await TeacherModel.getTeacherById(id, schoolId);

        if (!teacher) {
            throw new AppError("Teacher not found", 404);
        }

        const result=await TeacherModel.updateStatus(teacher.user_id,schoolId,status)
        return result
    },

    async deleteTeacher(id, schoolId) {
         const school = await SchoolModel.getSchoolProfile(schoolId);

        if (!school) {
            throw new AppError("School not found", 404);
        }

        if (school.status !== "Active") {
            throw new AppError("School is not active", 403);
        }

       
        const teacher = await TeacherModel.getTeacherById(id, schoolId);

        if (!teacher) {
            throw new AppError("Teacher not found", 404);
        }

        const connection= await pool.getConnection()
        try{
            await connection.beginTransaction()

            await TeacherModel.deleteTeacher( connection,id)
            await TeacherModel.deleteUser( connection,teacher.user_id)

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

module.exports = TeacherService;
