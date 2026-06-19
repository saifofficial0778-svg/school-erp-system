const pool = require('../config/db');

const ClassModel = {
    fetchAllClasses: async (schoolId) => {
        const query = `SELECT id, class_name, section FROM classes WHERE school_id = ?;`;
        const [rows] = await pool.query(query, [schoolId]);
        return rows;
    }
};

module.exports = ClassModel;