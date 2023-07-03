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
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    token: { type: String },
    role: {
      type: String,
      enum: ["admin", "instructor", "student", "editor"],
      default: "student",
    },
    profilePhoto: {
      type: Object,
      default: {
        url:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        publicId: null,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);
/**----------------------------
 * @todo check this fields
 ----------------------------*/
userSchema.virtual("createdCourses", {
  ref: "Course",
  foreignField: "instructor",
  localField: "_id",
});

userSchema.virtual("enrolledCourses", {
  ref: "Course",
  foreignField: "enroll",
  localField: "_id",
});

userSchema.virtual("cvs", {
  ref: "Cv",
  foreignField: "user",
  localField: "_id",
});

userSchema.virtual("articles", {
  ref: "Articles",
  foreignField: "creator",
  localField: "_id",
});

userSchema.virtual("certificates", {
  ref: "Certificates",
  foreignField: "user",
  localField: "_id",
});

userSchema.virtual("exams", {
  ref: "Exams",
  foreignField: "student",
  localField: "_id",
});

userSchema.virtual("lessons", {
  ref: "lessons",
  foreignField: "student",
  localField: "_id",
});

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
