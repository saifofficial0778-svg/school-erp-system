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

// ==================== 2. REGISTER SCHOOL API ====================
exports.registerSchool = async (req, res) => {
    try {
        // Screenshot ke mutabik: school_name, admin_email, aur password le rahe hain
        const { school_name, admin_email, password } = req.body;

        // 1. Validation check (Bhai, kuch khali toh nahi choda?)
        if (!school_name || !admin_email || !password) {
            return res.status(400).json({ message: "Saari fields bharna compulsory hai, bhai!" });
        }

        // 2. Duplicate Check: Kya yeh email pehle se users/schools table me hai?
        const [existingUsers] = await db.execute('SELECT * FROM schools WHERE admin_email = ?', [admin_email]);
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Yeh Email pehle se registered hai, login karo!" });
        }

        // 3. Password Hashing (Wahi technical mixer grinder!)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. SQL Query: Existing table (schools) me row insert karna
        // id auto-increment hai aur created_at default timestamp le lega
        const query = 'INSERT INTO schools (school_name, admin_email, password) VALUES (?, ?, ?)';
        await db.execute(query, [school_name, admin_email, hashedPassword]);

        // 5. Success Response! Auth UI isko dekh kar redirect login par karega
        return res.status(201).json({
            success: true,
            message: "School Table me kamyabi se register ho gaya! 🎉",
            redirectTo: "/login"
        });

    } catch (error) {
        console.error("MySQL Registration Error:", error);
        return res.status(500).json({ message: "Server me kuch gadbad hai, registration fail!" });
    }
};