const pool = require("../../../config/db");

const FeeStructureModel = {

    async createFeeStructure(schoolId, feeStructureData) {
        const {
            academicYearId,
            classId,
            feeTypeId,
            amount,
            frequency
        } = feeStructureData;

        const [result] = await pool.execute(
            `
        INSERT INTO fee_structures(
            school_id,
            academic_year_id,
            class_id,
            fee_type_id,
            amount,
            frequency
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
            [
                schoolId,
                academicYearId,
                classId,
                feeTypeId,
                amount,
                frequency
            ]
        );

        return result.insertId;
    },

    async getAllFeeStructures(schoolId) {
        const [result] = await pool.execute(
            `
            SELECT * FROM
             fee_structures
            WHERE school_id=?
                AND is_deleted=FALSE

            `, [schoolId]
        )
        return result
    },

    async getFeeStructureById(id, schoolId) {
        const [result] = await pool.execute(
            `
            SELECT * FROM
             fee_structures
            WHERE school_id=?
                AND id=?
                AND is_deleted=FALSE

            `, [schoolId, id]
        )
        return result[0]
    },

    async updateFeeStructure(id, schoolId, feeStructureData) {
        const {
            academicYearId,
            classId,
            feeTypeId,
            amount,
            frequency
        } = feeStructureData;

        const [result] = await pool.execute(
            `
            UPDATE fee_structures
            SET 
            academic_year_id=?,
            class_id=?,
            fee_type_id=?,
            amount=?,
            frequency=?
            WHERE id=?
                AND school_id=?
            `, [academicYearId, classId, feeTypeId, amount, frequency, id, schoolId]
        )
        return result.affectedRows
    },

    async updateStatus(id, schoolId, isActive) {
        const [result] = await pool.execute(
            `
        UPDATE fee_structures
        SET
            is_active=?
        WHERE
            id=?
            AND school_id=?
        `,
            [isActive, id, schoolId]
        );

        return result.affectedRows;
    },

    async deleteFeeStructure(id, schoolId) {
        const [result] = await pool.execute(
            `
            UPDATE fee_structures
            SET 
            is_deleted=TRUE
            WHERE id=?
                AND school_id=?
            `, [id, schoolId]
        )
        return result.affectedRows
    },

    async findFeeStructure(schoolId, academicYearId, classId, feeTypeId) {
        const [result] = await pool.execute(
            `
            SELECT id 
            FROM fee_structures
            WHERE school_id=?
                AND academic_year_id=?
                AND class_id=?
                AND fee_type_id=?
                AND is_deleted=FALSE
            `, [schoolId, academicYearId, classId, feeTypeId]
        )
        return result[0]
    },

    async findFeeStructureForUpdate(schoolId, academicYearId, classId, feeTypeId, excludeId) {
        const [result] = await pool.execute(
            `
            SELECT id 
            FROM fee_structures
            WHERE school_id=?
                AND academic_year_id=?
                AND class_id=?
                AND fee_type_id=?
                AND id!=?
                AND is_deleted=FALSE
            `, [schoolId, academicYearId, classId, feeTypeId, excludeId]
        )
        return result[0]
    }

};

module.exports = FeeStructureModel;