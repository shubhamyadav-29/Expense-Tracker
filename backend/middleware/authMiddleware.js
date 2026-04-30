const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Bearer token
    const decoded = jwt.verify(token, SECRET);

    req.user = decoded; // attach user id
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;