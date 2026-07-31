const SchoolController= require('./school.controller')
const router = require("express").Router();

router.get("/profile", SchoolController.getSchoolProfile);

router.put("/update", SchoolController.updateSchoolProfile);

router.patch("/status/", SchoolController.updateStatus);

router.delete("/delete", SchoolController.deleteSchool);

module.exports = router;