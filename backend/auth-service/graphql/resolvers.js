const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const resolvers = {
  Query: {
    users: async () => {
      return await User.find().sort({ createdAt: -1 });
    },
    me: async (_, { token }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return await User.findById(decoded.id);
      } catch (error) {
        throw new Error("Invalid token");
      }
    },
  },

  Mutation: {
    signup: async (_, { username, email, password, role }) => {
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        throw new Error("Username or email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      const token = generateToken(user);

      return {
        token,
        user,
        message: "Signup successful",
      };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      const token = generateToken(user);

      return {
        token,
        user,
        message: "Login successful",
      };
    },

    logout: async () => {
      return {
        token: null,
        user: null,
        message: "Logout successful",
      };
    },
  },
};

module.exports = resolvers;