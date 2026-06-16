const express = require('express');
const cors = require('cors'); // CORS import kar lo taaki React se dikkat na aaye
require('dotenv').config();    // Dotenv ko sabse upar initialize karna achha hota hai

const app = express();



// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Tumhaare frontend ka address
  credentials: true
}));
app.use(express.json());

// Routes Imports (Apne folder structure ke hisab se path check kar lena)
const studentRoutes = require('./routes/studentRoutes'); 
const feeRoutes = require('./routes/feeRoutes');

// Mount Routes
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/fees', feeRoutes);

// Error Handling Imports
const globalErrorHandler = require('./middlewares/errorController');
const AppError = require('./utils/AppError');

// 1. Unhandled Routes Catching (Standard '*' use karo)
app.all(/.*/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 2. Global Error Handling Middleware (Sabse aakhiri me)
app.use(globalErrorHandler);

// Port ko process.env se uthao, nahi toh 3000 fallback
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 ERP Backend MVC Server running on port ${PORT}`);
});