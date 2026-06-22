const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email])

        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid Email ya Password, bhai!" })
        }

        const user = users[0];

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid Email ya Password, bhai!" })
        }

        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        return res.status(200).json({
            success: true,
            message: "MYSQL login Kamyab raha",
            token: token,
            user: { id: user.id, name: user.name, role: user.role }
        })
    } catch (error) {
        console.error("MySQL Login Error:", error)
        return res.status(500).json({ message: "Server me kuch gadbad hai!" })
    }
};