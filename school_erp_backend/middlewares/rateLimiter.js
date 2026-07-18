const rateLimit=require('express-rate-limit')

const loginLimiter=rateLimit({
    windowMs:15*60*1000,
    max:5,
    message:{
        status:429,
        success:false,
        error:"Too many login attempts. Bhai 15 mins baad try karna."
    },
    standardHeaders:true,
    legacyHeaders:false,
});

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 1 minute me max 60 requests ek IP se
    message: {
        status: 429,
        success: false,
        error: "Bhai bohot fast click kar rahe ho, thoda slow!"
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports={
    loginLimiter,
    apiLimiter
};