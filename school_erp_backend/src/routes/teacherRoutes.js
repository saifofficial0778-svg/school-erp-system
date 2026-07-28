const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController')
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');

// 🛡️ Sabhi routes ke liye login mandatory hai (Global Auth)
router.use(verifyToken);

// 1. Get All Teachers (Admin dekh sake, ya ho sakta hai Student/Parent ko bhi list chahiye ho future me)
router.get('/', authorizeRoles('admin'), teacherController.getAllTeachers);

// 2. Get Teacher By ID (Admin ke liye)
router.get('/:teacherId', authorizeRoles('admin'), teacherController.getTeacherById);

// 3. Complete Profile View (Admin toh dekh hi sakta hai, aur Teacher khud bhi apni profile dekh sake!)
router.get('/:teacherId/profile-view', authorizeRoles('admin', 'teacher'), teacherController.getTeacherCompleteProfile);

router.get('/me/profile-view', authorizeRoles('teacher'), teacherController.getMyProfile);

// 4. Create, Update, Delete (Yeh core changes sirf aur sirf ADMIN kar sakta hai)
router.post('/', authorizeRoles('admin'), teacherController.createTeacher);
router.put('/:teacherId', authorizeRoles('admin'), teacherController.updateTeacher);
router.delete('/:teacherId', authorizeRoles('admin'), teacherController.deleteTeacher);



module.exports = router;