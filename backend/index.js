const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express(); // ✅ MUST be here

// Models
const User = require("./models/User");
const Post = require("./models/Post");
const authMiddleware = require("./middleware/authMiddleware");

// Secret key
const SECRET = "mysecretkey";

// Middleware
app.use(cors());
app.use(express.json());

/* ================== DATABASE ================== */
mongoose
  .connect("mongodb://127.0.0.1:27017/blogApp")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

/* ================== TEST ROUTE ================== */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* ================== AUTH ROUTES ================== */

// 🔥 REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userData } = user._doc;

    res.json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== BLOG ROUTES ================== */

// 🔥 GET ALL POSTS (public)
app.get("/api/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// 🔥 GET SINGLE POST (public)
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 CREATE POST (protected)
app.post("/api/posts", authMiddleware, async (req, res) => {
  try {
    const newPost = new Post({
      ...req.body,
      author: req.user.id,
    });

    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 UPDATE POST (protected + author check)
app.put("/api/posts/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 DELETE POST (protected + author check)
app.delete("/api/posts/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== SERVER ================== */
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});