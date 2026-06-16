const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw createError("JWT_SECRET is missing from .env", 500);
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const registerUser = async ({ username, email, password, role }) => {
  if (!username || !email || !password) {
    throw createError("Username, email, and password are required", 400);
  }

  if (password.length < 6) {
    throw createError("Password must be at least 6 characters long", 400);
  }

  if (role && !["ADMIN", "ORGANIZER", "REFEREE"].includes(role)) {
    throw createError("Invalid role", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

  if (existingUser) {
    throw createError("Email is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role,
  });

  return {
    user: sanitizeUser(user),
    token: generateToken(user._id),
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw createError("Email and password are required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+password"
  );

  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createError("Invalid email or password", 401);
  }

  return {
    user: sanitizeUser(user),
    token: generateToken(user._id),
  };
};

module.exports = {
  registerUser,
  loginUser,
};
