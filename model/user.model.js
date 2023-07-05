const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number },
    age: { type: Number },
    graduationYear: { type: Number },
    about: { type: String },
    nationality: { type: String },
    country: { type: String },
    city: { type: String },
    university: { type: String },
    major: { type: String },
    userId: { type: Number, unique: true },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    token: { type: String },
    role: { type: String, enum: ["admin", "instructor", "student", "editor"], default: "student", },
    profilePhoto: {
      type: Object, default: { url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png", publicId: null, },
    },

    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
    /**--------------------
     * @todo Test 
     * cvs: [{ type: mongoose.Schema.Types.ObjectId, ref: "CV" }],
     * articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
     * certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }],
     * exams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exam" }],
     *-------------------- */
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, userId: this.userId, role: this.role },
    process.env.JWT_SECRET_KEY
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;