const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const DataStore = require("../database/store");
const env = require("../config/env");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
};

const authController = {
  // POST /api/v1/auth/register
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: "Name, email, and password are required."
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: "Password must be at least 6 characters long."
        });
      }

      const existingUser = await DataStore.users.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: "An account with this email address already exists."
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await DataStore.users.create({
        name,
        email,
        passwordHash,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
      });

      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: "Registration successful.",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          preferences: user.preferences
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email and password are required."
        });
      }

      const user = await DataStore.users.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password."
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password."
        });
      }

      const token = generateToken(user);

      res.json({
        success: true,
        message: "Login successful.",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          preferences: user.preferences
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/auth/me
  async getMe(req, res, next) {
    try {
      const user = await DataStore.users.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User profile not found."
        });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          preferences: user.preferences
        }
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authController;
