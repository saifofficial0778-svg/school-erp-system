const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');

// 🛡️ Har request ke liye user ka logged-in hona zaroori hai (Token Check Global)
router.use(verifyToken); 

// 1. Class Create Endpoint (Sirf Admin naya class bana sakta hai)
router.post('/create', authorizeRoles('admin'), classController.addClass);

// 2. Dropdown Meta-data Fetch (Admin aur Teacher dono ko chahiye list dekhne ke liye)
router.get('/meta-data', authorizeRoles('admin', 'teacher'), classController.getClassDropdownData);

// 3. Student mapping (Admin class assign karega ya Teacher bhi kar sakta hai dependent on your ERP policy)
router.post('/assign-student', authorizeRoles('admin', 'teacher'), classController.assignStudent);

// 4. Get Students by Class (Attendance lene ke liye Teacher ko access chahiye hi chahiye!)
router.get('/:id/students', authorizeRoles('admin', 'teacher'), classController.getStudentsByClass);

module.exports = router;