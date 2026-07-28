const rateLimit=require('express-rate-limit')

const loginLimiter=rateLimit({
    windowMs:15*60*1000,
    max:5,
    standardHeaders:true,
    legacyHeaders:false,
    handler: (req, res) => {
        // req.rateLimit me sara time aur remaining info hoti hai
        const timeRemainingInSeconds = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
        
        return res.status(429).json({
            success: false,
            message: `Bohat saare attempts ho gaye! Dubara try karein.`,
            retryAfter: timeRemainingInSeconds // 🔥 Kitne seconds baad try karna hai
        });
    }
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