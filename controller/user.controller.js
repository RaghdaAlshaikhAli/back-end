const User = require("../model/user.model");
const validation = require("../validation/user.validation");
const { sendUserIdEmail } = require("../service/nodemailer.service");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../service/cloudinary.service");
const fs = require("fs")
const path = require("path");
const generateUniqueUserId = require("../service/uniqueId");

exports.activateUserAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById({ _id: id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isActive) {
            return res.status(400).json({ message: "User account is already active" });
        }

        await sendUserIdEmail(user.email, user.userId);
        user.isActive = true;
        await user.save();

        return res.status(200).json({ message: "Account activated successfully" });
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password")
            .populate({
                path: 'createdCourses',
                select: ['-instructor', "_id"],
            })
            .populate({
                path: 'enrolledCourses',
                select: ['-enroll', "_id"],
            })

        /** --------------------------
         * @ToDo populate 
         * @Test .populate('cvs').populate('articles').populate('certificates').populate('exams').populate('lessons')
            -------------------------- */
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        return res.status(200).json(users);
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password")
            .populate({
                path: 'createdCourses',
                select: ['-instructor', "_id"],
            })
            .populate({
                path: 'enrolledCourses',
                select: ['-enroll', "_id"],
            })
        /** --------------------------
         * @ToDo populate 
         * @Test .populate('cvs').populate('articles').populate('certificates').populate('exams').populate('lessons')
            -------------------------- */
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.newUser = async (req, res) => {
    try {
        const { email, userId, isActive } = req.body;
        const { error } = validation.newUser(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "This email is already in use" });
        }

        let newUserId = userId;

        if (!newUserId) {
            newUserId = await generateUniqueUserId();
        } else {
            const existingUserId = await User.findOne({ userId: newUserId });

            if (existingUserId) {
                return res.status(400).json({ message: "This User ID is already in use" });
            }
        }

        if (isActive === true) {
            await sendUserIdEmail(email, newUserId);
        }

        const newUser = new User({ ...req.body, userId: newUserId });
        await newUser.save();

        return res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = validation.updateUser(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        if (req.body.email !== req.user.email) {
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ message: "This email is already in use" });
            }
        }

        if (req.file) {
            const imagePath = path.resolve(__dirname, "../images", req.file.filename);
            const result = await cloudinaryUploadImage(imagePath);
            const user = await User.findById(req.user.id);

            if (user.profilePhoto.publicId !== null) {
                await cloudinaryRemoveImage(user.profilePhoto.publicId);
            }

            user.profilePhoto = {
                url: result.secure_url,
                publicId: result.public_id,
            };

            await user.save();
            fs.unlinkSync(imagePath);
        }

        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.profilePhoto?.publicId) {
            await cloudinaryRemoveImage(user.profilePhoto.publicId);
        }
        /** -----------------------
         * @todo need to delete all photos related to user  
           -----------------------*/
        /** -----------------------
         * @todo need to require all models 
         * await Courses.deleteMany({ user: user._id });
         * await Cvs.deleteMany({ user: user._id });
         * await Articles.deleteMany({ user: user._id });
         * await Certificates.deleteMany({ user: user._id });
         * await Exams.deleteMany({ user: user._id });
            -----------------------*/

        await User.findByIdAndDelete(id)

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};