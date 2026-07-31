const SchoolModel = require("./school.repository");
const AppError = require("../../utils/AppError");

const SchoolService = {

    async getSchoolProfile(id) {
        const school = await SchoolModel.getSchoolProfile(id)
        if (!school) {
            throw new AppError("School not found", 404)
        }
        return school
    },

    async updateSchoolProfile(id, updateData) {
        const school = await SchoolModel.getSchoolProfile(id)
        if (!school) {
            throw new AppError("School not found", 404)
        }
        const requiredFields = [
            "school_name",
            "email",
            "phone",
            "address_line",
            "city",
            "state",
            "country",
            "pincode",
            "board",
            "medium",
            "school_type",
            "timezone",
            "currency"
        ];

        for (const field of requiredFields) {
            if (!updateData[field]) {
                throw new AppError(`${field.replace(/_/g, " ")} is required.`, 400);
            }
        }

        const updateProfile = await SchoolModel.updateSchoolProfile(id, updateData)


        return updateProfile
    },

    async updateStatus(id, status) {
        const school = await SchoolModel.getSchoolProfile(id)
        if (!school) {
            throw new AppError("School not found", 404)
        }
        if (!status) {
            throw new AppError("Status is required.", 400);
        }
        const allowedStatus = ["Inactive", "Active"];

        if (!allowedStatus.includes(status)) {
            throw new AppError("Invalid status.", 400);
        }
        if (status === "Active") {
            throw new AppError("Only Super Admin can activate a school.", 403)
        }
        if (school.status === "Inactive") {
            throw new AppError("School is already inactive.", 400);
        }
        const result = await SchoolModel.updateStatus(id, status);
        if (result.affectedRows === 0) {
            throw new AppError("Failed to update school status.", 500);
        }

        return result;
    },

    async deleteSchool(id) {
        const school = await SchoolModel.getSchoolProfile(id)
        if (!school) {
            throw new AppError("School not found", 404)
        }
        const result = await SchoolModel.deleteSchool(id);

        // 4. Query success?
        if (result.affectedRows === 0) {
            throw new AppError("Failed to delete school.", 500);
        }

        return result;
    }

};

module.exports = SchoolService;