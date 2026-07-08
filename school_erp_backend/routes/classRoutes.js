const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken); // Pure routes protected hain

router.post('/add', classController.addClass);
router.get('/', classController.getClasses);
router.post('/assign-student', classController.assignStudent);
router.get('/:classId/students', classController.getClassStudents);

module.exports = router;