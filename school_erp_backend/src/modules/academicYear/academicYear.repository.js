const pool = require('../../config/db')

const AcademicYear = {

    async createAcademicYear(schoolId, session, startDate, endDate,status) {
        const [result] = await pool.execute(
            `INSERT INTO academic_years 
            (school_id,session, start_date,end_date,status)
            VALUES (?,?,?,?,?)`,
            [schoolId, session, startDate, endDate,status]

        );
        return result.insertId
    },

    async getAllAcademicYears(schoolId) {
        const [result] = await pool.execute(
            `SELECT id,session,start_date,end_date,status FROM academic_years 
            WHERE school_id=?
            ORDER BY start_date DESC`, [schoolId]
        )
        return result
    },

    async getAcademicYearById(id, schoolId) {
        const [result] = await pool.execute(
            `SELECT id,session,start_date,end_date,status FROM academic_years 
            WHERE id=? and school_id=?`, [id, schoolId]
        )
        return result[0]
    },

    async updateAcademicYear(id, schoolId, session, startDate, endDate) {
        const [result] = await pool.execute(`
            UPDATE academic_years
            SET
            session = ?,
            start_date = ?,
            end_date = ?
            WHERE
            id = ? AND school_id = ?; `, [session, startDate, endDate, id, schoolId])

        return result.affectedRows
    },

    async activateAcademicYear(id, schoolId) {
        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction();
            const [closedResult] = await connection.execute(
                `UPDATE academic_years
                SET 
                status='Closed'
                WHERE school_id=? AND status='Active'`, [schoolId]
            )

            const [activeResult] = await connection.execute(
                `UPDATE academic_years
                SET 
                status='Active'
                WHERE
                id=? and school_id=?`, [id, schoolId]
            )

            if (activeResult.affectedRows === 0) {
                throw new Error("Academic Year not found");
            }

            await connection.commit()

            return {
                success: true,
                affectedRows: activeResult.affectedRows
            };
        } catch (error) {
            await connection.rollback()
            throw new Error(`Database Error: ${error.message}`);

        } finally {
            connection.release()
        }
    },

    async getAcademicYearBySession(session, schoolId) {
        const [result] = await pool.execute(
            `SELECT id
            FROM academic_years
            WHERE session=? AND school_id=?
            LIMIT 1`, [session, schoolId]
        )
        return result[0]
    },

    async countAcademicYears(schoolId) {
        const [rows]=await pool.execute(`
            SELECT COUNT(*) AS total
            FROM academic_years
            WHERE school_id = ?;`,[schoolId]
        )
        return rows[0].total
    }


};

module.exports = AcademicYear;