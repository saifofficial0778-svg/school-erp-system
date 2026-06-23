const express=require('express')
const router=express.Router();

const authController=require('../controllers/authController');
const verifyToken=require('../middlewares/authMiddleware')

// Register School Route
router.post('/register-school', authController.registerSchool);

router.post('/login',authController.login)


router.get('/dashboard',verifyToken,(req,res)=>{
   
    const userId = req.user.userId;
    const userRole = req.user.role;

    return res.status(200).json({
        success: true,
        message: "Protected Route ka data mil gaya, bhai!",
        data: {
            text: `Welcome User ${userId}! Tumhara role ${userRole} hai.`,
            stats: "Yeh tumhara live MySQL ERP data hai."
        }
    });
});

module.exports=router;