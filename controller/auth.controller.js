const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const crypto =require('crypto')
const generateUniqueUserId = require("../services/uniqueId");
const validation = require("../validation/user.validation");
const { sendVerificationEmail } = require("../services/nodemailer.service");
const Token = require("../model/verificationToken.model");
exports.registerUser = async (req, res) => {
    try {
        const { email } = req.body;
        const { error } = validation.registerUser(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const
            existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const userId = await generateUniqueUserId();
        const newUser = new User({ ...req.body, userId });
        await newUser.save();

        const token = crypto.randomBytes(20).toString('hex');
        const newToken = new Token({ userId: newUser._id, token });
        await newToken.save();

        const verifyEmailLink = `${process.env.CLIENT_URL}api/user/${token}/verify-email`;
        await sendVerificationEmail(email, verifyEmailLink);

        res.status(201).json({ message: 'You have registered successfully. Please check your email for verification.' });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Internal server error.' });
    }
};
exports.loginUser = async (req, res) => {
    try {
        const { userId, password } = req.body
        const { error } = validation.loginUser(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const user = await User.findOne({ userId })
        if (!user) {
            return res.status(400).json({ message: "invalid credentials" })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "invalid credentials" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "account is not active" })
        }
        if (!user.isEmailVerified) {
            return res.status(403).json({ message: "check your email" })
        }
        const token = await user.generateAuthToken()
        user.token = token
        await user.save()

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
}