const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController')
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');

// 🛡️ Sabhi routes ke liye login hona mandatory hai (Global Auth)
router.use(verifyToken); 

// 1. Get All Students (Sirf Admin aur Teacher dekh sakein, attendance lagane ke liye bhi chahiye)
router.get('/', authorizeRoles('admin', 'teacher'), studentController.getAllStudents);

// 2. Get Student By ID (Admin aur Teacher ke liye)
router.get('/:studentId', authorizeRoles('admin', 'teacher'), studentController.getStudentById);

// 3. Complete Profile View (Admin toh dekh hi sakta hai, aur Student khud bhi dekh sakta hai!)
router.get('/:studentId/profile-view', authorizeRoles('admin'), studentController.getStudentCompleteProfile);

router.get('/me/profile-view', authorizeRoles('student'), studentController.getMyProfile);

// 4. Create, Update, Delete (Yeh core operations sirf aur sirf ADMIN kar sakta hai)
router.post('/', authorizeRoles('admin'), studentController.createStudent);
router.put('/:studentId', authorizeRoles('admin'), studentController.updateStudent);
router.delete('/:studentId', authorizeRoles('admin'), studentController.deleteStudent);

module.exports = router;