const pool = require("../../config/db");

const TeacherModel = {

    // Create
    async createUser(connection, userData) {
        const {
            schoolId,
            fullName,
            email,
            phone,
            password,
            role
        } = userData;

        const [result] = await connection.execute(
            `INSERT INTO users(
            school_id,
            full_name,
            email,
            phone,
            password,
            role )
            VALUES (?,?,?,?,?,?)`,
            [schoolId, fullName, email, phone, password, role]
        )
        return result.insertId
    },

    async createTeacher(connection, teacherData) {
        const {
            userId,
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
        } = teacherData;


        const [result] = await connection.execute(
            `INSERT INTO teachers (
             user_id,
             school_id,
             employee_code,
             qualification,
             experience_years,
             joining_date,
             salary,
             gender,
             date_of_birth,
             address,
             aadhaar_number,
             photo
             )
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
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
            ]
        );

        return result.insertId;
    },

    // Read
    async getAllTeachers(schoolId) {
        const [teachers] = await pool.execute(
            `
        SELECT
            t.id,
            u.full_name,
            u.email,
            u.phone,
            u.is_active,

            t.employee_code,
            t.qualification,
            t.experience_years,
            t.joining_date,
            t.salary,
            t.gender,
            t.date_of_birth,
            t.address,
            t.aadhaar_number,
            t.photo

        FROM teachers t
        INNER JOIN users u
            ON t.user_id = u.id

        WHERE
            u.school_id = ?
            AND u.role = 'Teacher'
            AND u.is_deleted = FALSE
            AND t.is_deleted = FALSE
        `,
            [schoolId]
        );

        return teachers;
    },

    async getTeacherById(id, schoolId) {
        const [teacher] = await pool.execute(
            `
        SELECT
            t.id,
             t.user_id,  
            u.full_name,
            u.email,
            u.phone,
            u.is_active,

            t.employee_code,
            t.qualification,
            t.experience_years,
            t.joining_date,
            t.salary,
            t.gender,
            t.date_of_birth,
            t.address,
            t.aadhaar_number,
            t.photo

        FROM teachers t
        INNER JOIN users u
            ON t.user_id = u.id

        WHERE
            t.id = ?
            AND u.school_id = ?
            AND u.role = 'Teacher'
            AND u.is_deleted = FALSE
            AND t.is_deleted = FALSE
        `,
            [id, schoolId]
        );

        return teacher[0];
    },

    // Update
    async updateUser(connection, userId, userData) {
        const {
            fullName,
            email,
            phone,
        } = userData;

        const [result] = await connection.execute(
            `UPDATE users
            SET
            full_name=?,
            email=?,
            phone=?
            WHERE id=? `,
            [fullName, email, phone, userId]
        )
        return result.affectedRows

    },

    async updateTeacher(connection, teacherId, teacherData) {

        const {
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
        } = teacherData;

        const [result] = await connection.execute(
            `
        UPDATE teachers
        SET
            qualification = ?,
            experience_years = ?,
            joining_date = ?,
            salary = ?,
            gender = ?,
            date_of_birth = ?,
            address = ?,
            aadhaar_number = ?,
            photo = ?
            WHERE
            school_id = ?
            AND id = ?
        `,
            [
                qualification,
                experienceYears,
                joiningDate,
                salary,
                gender,
                dateOfBirth,
                address,
                aadhaarNumber,
                photo,
                schoolId,
                teacherId
            ]
        );

        return result.affectedRows;
    },

    async updateStatus(userId, schoolId, status) {
        const [result] = await pool.execute(
            `
            UPDATE users
            SET
            is_active=?
            WHERE
            id=? and school_id=?
            `, [status, userId, schoolId]
        )
        return result.affectedRows
    },

    // Delete
    async deleteUser(connection, userId) {
        const [result] = await connection.execute(
            `
            UPDATE users
            SET is_deleted = TRUE
            WHERE id=?
            `, [userId]
        )
        return result.affectedRows
    },

    async deleteTeacher(connection, teacherId) {
        const [result] = await connection.execute(
            `
        UPDATE teachers
        SET is_deleted = TRUE
        WHERE id = ?
        `,
            [teacherId]
        );

        return result.affectedRows;
    },

    // Validation
    async findUserByEmail(email, schoolId) {

        const [users] = await pool.execute(
            `
        SELECT id
        FROM users
        WHERE
            email = ?
            AND school_id = ?
            AND role = 'Teacher'
            AND is_deleted = FALSE
        `,
            [email, schoolId]
        );

        return users[0];
    },

    async findUserByPhone(phone, schoolId) {

        const [users] = await pool.execute(
            `
        SELECT id
        FROM users
        WHERE
            phone = ?
            AND school_id = ?
            AND role = 'Teacher'
            AND is_deleted = FALSE
        `,
            [phone, schoolId]
        );

        return users[0];
    },

    async findTeacherByAadhaar(aadhaarNumber, schoolId) {

        const [teachers] = await pool.execute(
            `
        SELECT t.id
        FROM teachers t
        INNER JOIN users u
            ON t.user_id = u.id
        WHERE
            t.aadhaar_number = ?
            AND u.school_id = ?
            AND u.role = 'Teacher'
            AND u.is_deleted = FALSE
            AND t.is_deleted = FALSE
        `,
            [aadhaarNumber, schoolId]
        );

        return teachers[0];
    },
    async findUserByEmailForUpdate(email, schoolId, excludeUserId) {

        const [users] = await pool.execute(
            `
        SELECT id
        FROM users
        WHERE
            email = ?
            AND school_id = ?
            AND role = 'Teacher'
            AND is_deleted = FALSE
            AND id != ?
        `,
            [email, schoolId, excludeUserId]
        );

        return users[0];
    },

    async findUserByPhoneForUpdate(phone, schoolId, excludeUserId) {

        const [users] = await pool.execute(
            `
        SELECT id
        FROM users
        WHERE
            phone = ?
            AND school_id = ?
            AND role = 'Teacher'
            AND is_deleted = FALSE
            AND id!=?
        `,
            [phone, schoolId, excludeUserId]
        );

        return users[0];
    },

    async findTeacherByAadhaarForUpdate(aadhaarNumber, schoolId, excludeUserId) {

        const [teachers] = await pool.execute(
            `
        SELECT t.id
        FROM teachers t
        INNER JOIN users u
            ON t.user_id = u.id
        WHERE
            t.aadhaar_number = ?
            AND u.school_id = ?
            AND u.role = 'Teacher'
            AND u.is_deleted = FALSE
            AND t.is_deleted = FALSE
            AND t.id!=?
        `,
            [aadhaarNumber, schoolId, excludeUserId]
        );

        return teachers[0];
    },
};

module.exports = TeacherModel;
