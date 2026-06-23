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
            role: user.role,
            school_id: user.school_id 
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
        // Frontend body se ye teen parameters aayenge
        const { school_name, admin_email, password } = req.body;

        // 🚨 1. AIRTIGHT VALIDATION
        if (!school_name || !admin_email || !password) {
            return res.status(400).json({ success: false, message: "Saari fields bharna compulsory hai, bhai!" });
        }

        // 🚨 2. DUPLICATE EMAIL CHECK (Kyunki users table me email unique hona chahiye)
        const [existingUsers] = await db.execute('SELECT * FROM users WHERE email = ?', [admin_email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: "Yeh Email pehle se users me registered hai!" });
        }

        // 🚨 3. BCRYPT PASSWORD HASHING
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 🚨 4. STEP 1: INSERT INTO 'schools' TABLE FIRST
        const schoolQuery = 'INSERT INTO schools (school_name, admin_email, password) VALUES (?, ?, ?)';
        const [schoolResult] = await db.execute(schoolQuery, [school_name, admin_email, hashedPassword]);
        
        // Dynamic Extraction: Naye bane school ki auto-incremented ID nikalenge
        // Note: Relational logic ke liye school_id hamesha users table me map honi chahiye
        const newSchoolId = schoolResult.insertId || 1; 

        // 🚨 5. STEP 2: INSERT INTO 'users' TABLE (Matching Exact Screenshot Fields!)
        // Column mapping: school_id, email, password, role, is_active
        const userQuery = 'INSERT INTO users (school_id, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)';
        
        // Param details: newSchoolId (dynamic), admin_email, hashedPassword, role='admin', is_active=1
        await db.execute(userQuery, [newSchoolId, admin_email, hashedPassword, 'admin', 1]);

        // 🟢 6. SUCCESS RESPONSE
        return res.status(201).json({
            success: true,
            message: "School aur Admin accounts dono tables me kamyabi se locked ho gaye! 🎉",
            redirectTo: "/login"
        });

    } catch (error) {
        console.error("MySQL Registration Structural Error:", error);
        return res.status(500).json({ success: false, message: "Server me kuch gadbad hai, registration fail!" });
    }
};