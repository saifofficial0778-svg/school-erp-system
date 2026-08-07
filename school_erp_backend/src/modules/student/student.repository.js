const pool = require("../../config/db");

const StudentModel = {

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
            `
            INSERT INTO users (
            school_id,
            full_name,
            email,
            phone,
            password,
            role)
            VALUES (?, ?, ?, ?, ?,?)`,
            [schoolId, fullName, email, phone, password, role]
        )
        return result.insertId

    },

    async createStudent(connection, studentData) {
        const {
            userId,
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
        } = studentData

        const [result] = await connection.execute(
            `
            INSERT INTO students(
            user_id,
            school_id,
            admission_number,
            admission_date,
            father_name,
            mother_name,
            guardian_name,
            guardian_phone,
            gender,
            date_of_birth,
            address,
            aadhaar_number,
            photo)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, schoolId, admissionNumber, admissionDate, fatherName, motherName, guardianName, guardianPhone, gender, dateOfBirth, address, aadhaarNumber, photo]
        )
        return result.insertId

    },

    async getAllStudents(schoolId) {
        const [students] = await pool.execute(
            `
            SELECT 
            s.id,
            u.full_name,
            u.email,
            u.phone,
            u.is_active,

            s.admission_number,
            s.admission_date,
            s.father_name,
            s.mother_name,
            s.guardian_name,
            s.guardian_phone,
            s.gender,
            s.date_of_birth,
            s.address,
            s.aadhaar_number,
            s.photo

            FROM students s
            INNER JOIN users u
            ON s.user_id=u.id

            WHERE
            u.school_id = ?
            AND u.role = 'Student'
            AND u.is_deleted = FALSE
            AND s.is_deleted = FALSE
            `, [schoolId]
        )
        return students
    },

    async getStudentById(id, schoolId) {
        const [student] = await pool.execute(
            `
            SELECT 
            s.id,
            s.user_id,
            u.full_name,
            u.email,
            u.phone,
            u.is_active,

            s.admission_number,
            s.admission_date,
            s.father_name,
            s.mother_name,
            s.guardian_name,
            s.guardian_phone,
            s.gender,
            s.date_of_birth,
            s.address,
            s.aadhaar_number,
            s.photo

            FROM students s
            INNER JOIN users u
            ON s.user_id=u.id

            WHERE
            s.id=? AND
            u.school_id = ?
            AND u.role = 'Student'
            AND u.is_deleted = FALSE
            AND s.is_deleted = FALSE
            `, [id, schoolId]
        )
        return student[0]
    },

    async updateUser(connection, userId, userData) {
        const {
            fullName,
            email,
            phone,
        } = userData;

        const [result] = await connection.execute(
            `
            UPDATE users
            SET
                full_name=?,
                email=?,
                phone=?
            WHERE 
                id=? 
            `, [fullName, email, phone, userId]
        )
        return result.affectedRows
    },

    async updateStudent(connection, studentId, studentData) {
        const {
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
        } = studentData

        const [result]=await connection.execute(
            `
            UPDATE students
            SET
                father_name=?,
                mother_name=?,
                guardian_name=?,
                guardian_phone=?,
                gender=?,
                date_of_birth=?,
                address=?,
                aadhaar_number=?,
                photo=?
            WHERE
                id=? AND
                school_id=?
            `,
            [fatherName,motherName,guardianName,guardianPhone,gender,dateOfBirth,address,aadhaarNumber,photo,studentId,schoolId]

        )
        return result.affectedRows
    },

    async updateStatus(userId, schoolId, status) {
        const [result]= await pool.execute(
            `
            UPDATE users
            SET
                is_active=?
            WHERE
                id=?
                AND school_id=?

            `,
            [status,userId,schoolId]
        )
        return result.affectedRows
    },

    async deleteUser(connection, userId) {
        const [result]=await connection.execute(
            `
            UPDATE users
            SET
                is_deleted=TRUE
            WHERE
                id=?
            `,[userId]
        )
        return result.affectedRows
    },

    async deleteStudent(connection, studentId) {
         const [result]=await connection.execute(
            `
            UPDATE students
            SET
                is_deleted=TRUE
            WHERE
                id=?
            `,[studentId]
        )
        return result.affectedRows
    },
    async findUserByEmail(email, schoolId) {
        const [result]=await pool.execute(
            `
            SELECT id
            FROM users
            WHERE 
                email=?
                AND school_id=?
                AND role = 'Student'
                AND is_deleted = FALSE
            `,
            [email, schoolId]
        )
        return result[0]
    },

    async findUserByPhone(phone, schoolId) {
        const [result]=await pool.execute(
            `
            SELECT id
            FROM users
            WHERE 
                phone=?
                AND school_id=?
                AND role = 'Student'
                AND is_deleted = FALSE
            `,
            [phone, schoolId]
        )
        return result[0]
    },

    async findStudentByAdmissionNumber(admissionNumber, schoolId) {
        const [result]=await pool.execute(
            `
            SELECT id
            FROM students
            WHERE 
                admission_number=?
                AND school_id=?
                AND is_deleted = FALSE
            `,
            [admissionNumber, schoolId]
        )
        return result[0]
    },

    async findStudentByAadhaar(aadhaarNumber, schoolId) {
        const [result]=await pool.execute(
            `
            SELECT id
            FROM students
            WHERE 
                aadhaar_number=?
                AND school_id=?
                AND is_deleted = FALSE
            `,
            [aadhaarNumber, schoolId]
        )
        return result[0]
    },
    async findUserByEmailForUpdate(email, schoolId, excludeUserId) {
        const [result]=await pool.execute(
            `
            SELECT id
            FROM users
            WHERE 
                email=?
                AND school_id=?
                AND id!=?
                AND role = 'Student'
                AND is_deleted = FALSE
            `,
            [email, schoolId,excludeUserId]
        )
        return result[0]
    },

    async findUserByPhoneForUpdate(phone, schoolId, excludeUserId) {
        const [result]=await pool.execute(
            `
            SELECT id
            FROM users
            WHERE 
                phone=?
                AND school_id=?
                AND id!=?
                AND role = 'Student'
                AND is_deleted = FALSE
            `,
            [phone, schoolId,excludeUserId]
        )
        return result[0]
    },

    async findStudentByAdmissionNumberForUpdate(admissionNumber, schoolId, excludeStudentId) {
        const [result]=await pool.execute(
            `
            SELECT s.id
            FROM students s
            INNER JOIN users u
                ON s.user_id=u.id
            WHERE 
                s.admission_number=?
                AND u.school_id=?
                AND s.id!=?
                AND u.role = 'Student'
                AND u.is_deleted = FALSE
                AND s.is_deleted = FALSE
            `,
            [admissionNumber, schoolId,excludeStudentId]
        )
        return result[0]
    },

    async findStudentByAadhaarForUpdate(aadhaarNumber, schoolId, excludeStudentId) {
        const [result]=await pool.execute(
            `
             SELECT s.id
            FROM students s
            INNER JOIN users u
                ON s.user_id=u.id
            WHERE 
                s.aadhaar_number=?
                AND u.school_id=?
                AND s.id!=?
                AND u.role = 'Student'
                AND u.is_deleted = FALSE
                AND s.is_deleted = FALSE
            `,
            [aadhaarNumber, schoolId,excludeStudentId]
        )
        return result[0]
    }

};

module.exports = StudentModel;