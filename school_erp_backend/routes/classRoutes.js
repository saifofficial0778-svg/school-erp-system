const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const verifyToken = require('../middlewares/authMiddleware');

// 🛡️ Pure routes token se protected hain
router.use(verifyToken); 

// 1. Class Create Endpoint (Frontend ke API.post('/classes/create') se mapped)
router.post('/create', classController.addClass);

// 2. Dropdown Meta-data Fetch (Frontend ke API.get('/classes/meta-data') se mapped)
router.get('/meta-data', classController.getClassDropdownData);

// 3. Student mapping (Frontend ke API.post('/classes/assign-student') se mapped)
router.post('/assign-student', classController.assignStudent);

module.exports = router;