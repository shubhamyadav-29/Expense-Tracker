const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// Models
const User = require("./models/User");
const Post = require("./models/Post");

// Secret key (later move to .env)
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

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
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

    // Validation
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

    // Token with expiry
    const token = jwt.sign({ id: user._id }, SECRET, {
      expiresIn: "7d",
    });

    // Remove password from response
    const { password: _, ...userData } = user._doc;

    res.json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== BLOG ROUTES ================== */

// 🔥 GET ALL POSTS
app.get("/api/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// 🔥 CREATE POST
app.post("/api/posts", async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.json(newPost);
});

// 🔥 GET SINGLE POST
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

// 🔥 UPDATE POST
app.put("/api/posts/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 DELETE POST
app.delete("/api/posts/:id", async (req, res) => {
  try {
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