const SchoolModel = require("../modules/school/school.repository");
const AppError = require("./AppError");

const validateSchool = async (schoolId) => {
    const school = await SchoolModel.getSchoolProfile(schoolId);

    if (!school) {
        throw new AppError("School not found", 404);
    }

    if (school.status !== "Active") {
        throw new AppError("School is not active", 403);
    }

    return school;
};

module.exports = validateSchool;