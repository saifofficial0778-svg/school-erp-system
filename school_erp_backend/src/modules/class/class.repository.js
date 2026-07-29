const db = require("../../config/db");

const Class = {

    async createClass(schoolId, academicYearId, className) {
        const [result] = await db.execute(
            `INSERT INTO classes
        (school_id, academic_year_id, class_name)
        VALUES (?, ?, ?)`,
            [schoolId, academicYearId, className]
        );

        return result.insertId;
    },

    async getClassById(id, schoolId) {
        const [result] = await db.execute(
            `SELECT
            id,
            school_id,
            academic_year_id,
            class_name,
            status,
            is_deleted,
            created_at,
            updated_at
        FROM classes
        WHERE id = ?
          AND school_id = ?
          AND is_deleted = FALSE`,
            [id, schoolId]
        );

        return result[0];
    },

    async getClassByName(className, academicYearId, schoolId) {
        const [result] = await db.execute(
            `SELECT
            id,
            school_id,
            academic_year_id,
            class_name,
            status,
            is_deleted,
            created_at,
            updated_at
        FROM classes
        WHERE class_name = ?
          AND academic_year_id = ?
          AND school_id = ?
          AND is_deleted = FALSE`,
            [className, academicYearId, schoolId]
        );

        return result[0];
    },

    async getAllClasses(schoolId) {
         const [result] = await db.execute(
            `SELECT
            id,
            school_id,
            academic_year_id,
            class_name,
            status,
            is_deleted,
            created_at,
            updated_at
        FROM classes
        WHERE school_id = ?
          AND is_deleted = FALSE`,[schoolId]

         )
         return result
    },

    async updateClass(id, schoolId, academicYearId, className) {
        const [result]=await db.execute(
            `UPDATE classes
            SET
            class_name=?
            WHERE
            id=? AND school_id=? AND academic_year_id=?
            `,[className,id,schoolId,academicYearId]

        )
        return result.affectedRows
    },

    async updateStatus(id, status, schoolId) {
        const [result] = await db.execute(
        `UPDATE classes
         SET
        status = ?
         WHERE
            id = ?
            AND school_id = ?`,
        [status, id, schoolId]
    );

    return result.affectedRows;
    },

   async deleteClass(id, schoolId) {
    const [result] = await db.execute(
        `UPDATE classes
         SET is_deleted = TRUE
         WHERE id = ?
           AND school_id = ?`,
        [id, schoolId]
    );

    return result.affectedRows;
},

};

module.exports = Class;