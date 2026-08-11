const pool = require("../../../config/db");

const FeeTypeModel = {

    async createFeeType(schoolId, feeTypeData) {
        const { name, description } = feeTypeData;

        const [result] = await pool.execute(
            `
        INSERT INTO fee_types (
            school_id,
            name,
            description
        )
        VALUES (?, ?, ?)
        `,
            [schoolId, name, description]
        );

        return result.insertId;
    },

    async getAllFeeTypes(schoolId) {
        const [result] = await pool.execute(
            `
            SELECT * FROM fee_types
            WHERE school_id=?
                AND is_deleted=FALSE

            `, [schoolId]
        )
        return result
    },

    async getFeeTypeById(id, schoolId) {
        const [result] = await pool.execute(
            `
            SELECT * FROM fee_types
            WHERE id=? 
                AND school_id=?
                AND is_deleted=FALSE

            `, [id, schoolId]
        )
        return result[0]
    },

    async updateFeeType(id, schoolId, feeTypeData) {
        const [result] = await pool.execute(
            `
        UPDATE fee_types
        SET
            name=?,
            description=?
        WHERE
            id=?
            AND school_id=?
        `,
            [feeTypeData.name, feeTypeData.description, id, schoolId]
        );

        return result.affectedRows;
    },
    async updateStatus(id, schoolId, status) {
        const [result] = await pool.execute(
            `
        UPDATE fee_types
        SET
            is_active=?
        WHERE
            id=?
            AND school_id=?
        `,
            [status, id, schoolId]
        );

        return result.affectedRows;
    },

    async deleteFeeType(id, schoolId) {
        const [result] = await pool.execute(
            `
        UPDATE fee_types
        SET
            is_deleted=1
        WHERE
            id=?
            AND school_id=?
        `,
            [id, schoolId]
        );

        return result.affectedRows;
    },

    async findFeeTypeByName(name, schoolId) {
        const [result] = await pool.execute(
            `
            SELECT id
            FROM fee_types
            WHERE 
                name=?
                AND school_id=?

            `, [name, schoolId]

        )
        return result[0]
    },

    async findFeeTypeByNameForUpdate(name, schoolId, excludeId) {
        const [result] = await pool.execute(
            `
        SELECT id
        FROM fee_types
        WHERE
            name=?
            AND school_id=?
            AND id!=?
            AND is_deleted=FALSE
        `,
            [name, schoolId, excludeId]
        );

        return result[0];
    }

};

module.exports = FeeTypeModel;