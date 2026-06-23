const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/',verifyToken, classController.getAllClasses);

module.exports = router;