// utils/catchAsync.js

// Yeh ek Higher-Order Function hai (jo function ko input leta hai aur function return karta hai)
module.exports = (theFunction) => {
    return (req, res, next) => {
        // theFunction hamara async route function hai jo hum pass karenge.
        // Agar wo successfully chal gaya toh thik, agar reject (error) hua toh .catch(next) chalega
        theFunction(req, res, next).catch(next); 
    };
};