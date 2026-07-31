const pool = require("../../config/db");

const SchoolModel = {

    async getSchoolProfile(id) {
        const [result] = await pool.execute(
            `SELECT * FROM schools
            WHERE id=? And is_deleted=False`, [id]
        )
        return result[0]
    },

    async updateSchoolProfile(id, updateData) {

    const [result] = await pool.execute(
        `UPDATE schools
         SET
            school_name = ?,
            logo = ?,
            email = ?,
            phone = ?,
            alternate_phone = ?,
            website = ?,
            address_line = ?,
            city = ?,
            state = ?,
            country = ?,
            pincode = ?,
            principal_name = ?,
            board = ?,
            medium = ?,
            school_type = ?,
            timezone = ?,
            currency = ?,
            description = ?
         WHERE id = ?
         AND is_deleted = FALSE`,
        [
            updateData.school_name,
            updateData.logo,
            updateData.email,
            updateData.phone,
            updateData.alternate_phone,
            updateData.website,
            updateData.address_line,
            updateData.city,
            updateData.state,
            updateData.country,
            updateData.pincode,
            updateData.principal_name,
            updateData.board,
            updateData.medium,
            updateData.school_type,
            updateData.timezone,
            updateData.currency,
            updateData.description,
            id
        ]
    );

    return result;
},

    async updateStatus(id, status) {
    const [result] = await pool.execute(
        `UPDATE schools
         SET status = ?
         WHERE id = ?
         AND is_deleted = FALSE`,
        [status, id]
    );

    return result;
},

    async deleteSchool(id) {
        const [result]=await pool.execute(
            `UPDATE schools
            SET
            is_deleted=True
            WHERE id=?
            AND is_deleted=False
            `,[id]
        )
        return result
    }

};

module.exports = SchoolModel;