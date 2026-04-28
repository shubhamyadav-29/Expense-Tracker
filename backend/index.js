const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import model
const Post = require("./models/Post");

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/blogApp")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// 🔥 GET all posts
app.get("/api/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// 🔥 CREATE post
app.post("/api/posts", async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.json(newPost);
});

app.delete("/api/posts/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 GET single post (IMPORTANT FIX)
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

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});