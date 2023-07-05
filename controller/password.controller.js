const crypto = require("crypto");
const User = require("../model/user.model");
const bcrypt = require("bcryptjs")
const validation = require("../validation/user.validation")
const { sendPasswordResetEmail } = require("../services/nodemailer.service");
const Token = require("../model/verificationToken.model");

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const token = crypto.randomBytes(20).toString('hex')
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const newToken = new Token({ userId: user._id, token })
        await newToken.save()
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
        await sendPasswordResetEmail(email, resetLink);
        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const { error } = validation.password({ password })
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const resetToken = await Token.findOne({ token });
        if (!resetToken) {
            return res.status(400).json({ message: 'Your link expired, please resend email' });
        }
        const user = await User.findById(resetToken.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        user.password = password
        await user.save();
        await Token.deleteOne({ token: resetToken.token });
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
