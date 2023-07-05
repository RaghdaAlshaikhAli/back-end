const Joi = require("joi");
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const messages = {
  firstName: {
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name must be less than or equal to 30 characters",
    "any.required": "First name is required",
  },
  lastName: {
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name must be less than or equal to 30 characters",
    "any.required": "Last name is required",
  },
  email: {
    "string.min": "Email must be at least 5 characters long",
    "string.max": "Email must be less than or equal to 100 characters",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  },
  userId: {
    "any.required": "User ID is required",
    'number.base': 'User ID must be a number',
    'number.positive': 'User ID must be a positive number',
    'number.min': 'User ID must be 9 numbers',
    'number.max': 'User ID cannot be more than 9 numbers',
  },
  age: {
    "number.base": "Age must be a number.",
    "number.integer": "Age must be an integer.",
    "number.positive": "Age must be a positive number.",
  },
  phoneNumber: {
    "number.base": "Phone number must be a number."
  },
  password: {
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must be less than or equal to 32 characters",
    "string.pattern.base":
      "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character.",
    "any.required": "Password is required",
  },
};

module.exports = {
  registerUser: (obj) => {
    const schema = Joi.object({
      firstName: Joi.string().trim().min(2).max(30).required().messages(messages.firstName),
      lastName: Joi.string().trim().min(2).max(30).required().messages(messages.lastName),
      email: Joi.string().trim().min(5).max(100).required().email().messages(messages.email),
      password: Joi.string().trim().min(8).max(32).pattern(passwordRegex).required().messages(messages.password),
    });
    return schema.validate(obj);
  },
  loginUser: (obj) => {
    const schema = Joi.object({
      userId: Joi.number().integer().positive().min(100000000).max(999999999).required().messages(messages.userId),
      password: Joi.string().trim().min(8).max(32).required(),
    });
    return schema.validate(obj);
  },
  newUser: (obj) => {
    const schema = Joi.object({
      firstName: Joi.string().trim().min(2).max(30).required().messages(messages.firstName),
      lastName: Joi.string().trim().min(2).max(30).required().messages(messages.lastName),
      email: Joi.string().trim().min(5).max(100).required().email().messages(messages.email),
      password: Joi.string().trim().min(8).max(32).pattern(passwordRegex).required().messages(messages.password),
      userId: Joi.number().integer().positive().min(100000000).max(999999999).messages(messages.userId),
      phoneNumber: Joi.number().messages(messages.phoneNumber),
      role: Joi.string().valid("admin", "instructor", "student", "editor").default("student"),
      isActive: Joi.boolean().default(false),
    })
    return schema.validate(obj);
  },
  updateUser: (obj) => {
    const schema = Joi.object({
      firstName: Joi.string().trim().min(2).max(30).messages(messages.firstName),
      lastName: Joi.string().trim().min(2).max(30).messages(messages.lastName),
      email: Joi.string().trim().min(5).max(100).email().messages(messages.email),
      phoneNumber: Joi.number().messages(messages.phoneNumber),
      age: Joi.number().integer().positive().messages(messages.age),
      graduationYear: Joi.number().integer().positive().messages(messages.graduationYear),
      about: Joi.string().trim().min(2),
      nationality: Joi.string().trim().min(2),
      country: Joi.string().trim().min(2),
      city: Joi.string().trim().min(2),
      university: Joi.string().trim().min(2),
      major: Joi.string().trim().min(2),
    })
    return schema.validate(obj);
  },
  password: (obj) => {
    const schema = Joi.object({
      password: Joi.string().trim().min(8).max(32).pattern(passwordRegex).required().messages(messages.password)
    })
    return schema.validate(obj);
  }
}