
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');
const Otp = require('../models/Otp');
const ActivityLog = require('../models/ActivityLog');

// Generate OTP (Mock)
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register Step 1: Request OTP
exports.requestOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Save OTP
        await Otp.create({ email, otp: otpCode, expiresAt });

        // Mock Send Email (Log to console)
        console.log(`[MOCK EMAIL] OTP for ${email}: ${otpCode}`);

        await ActivityLog.create({
            action: 'OTP_REQUEST',
            details: `OTP requested for ${email}`,
            userId: null
        });

        res.json({ message: 'OTP sent to email (check console logs)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Register Step 2: Verify OTP and Create User
exports.register = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        // Validate OTP
        const validOtp = await Otp.findOne({
            where: {
                email,
                otp,
                expiresAt: { [Op.gt]: new Date() }
            }
        });

        if (!validOtp) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: { password: hashedPassword, isVerified: true }
        });

        if (!created) {
            // Update user if exists but not verified? Or just return error?
            // Simple case: Error if already exists
            return res.status(400).json({ error: 'User already exists' });
        }

        // Cleanup OTP
        await Otp.destroy({ where: { email } });

        await ActivityLog.create({
            action: 'REGISTER',
            details: `User registered: ${email}`,
            userId: user.id
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await ActivityLog.create({
                action: 'LOGIN_FAILED',
                details: `Failed login attempt for ${email}`,
                userId: user.id
            });
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate Tokens
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
        const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret', { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' });

        await ActivityLog.create({
            action: 'LOGIN_SUCCESS',
            details: `User logged in`,
            userId: user.id
        });

        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
