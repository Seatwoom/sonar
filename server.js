const express = require("express");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const UPLOAD_DIR = path.join(__dirname, "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

class UserRepository {
  constructor() {
    this.users = [];
  }

  getAll(limit = 10, offset = 0) {
    return this.users.slice(offset, offset + limit);
  }

  findById(id) {
    if (!id) return null;
    return this.users.find((user) => user.id === id) || null;
  }

  add(userData) {
    if (!userData || !userData.id || !userData.name) {
      throw new Error("Invalid user data");
    }

    const newUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email || "",
      active: userData.active || false,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return newUser;
  }

  remove(id) {
    if (!id) return false;

    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);

    return this.users.length < initialLength;
  }

  clear() {
    this.users = [];
  }
}

const userRepository = new UserRepository();

function errorHandler(err, req, res, next) {
  console.error("Error occurred:", err);
  const statusCode = err.statusCode || 500;
  const message =
    NODE_ENV === "production"
      ? "An error occurred. Please try again."
      : err.message;

  res.status(statusCode).json({ error: message });
}

function validateUser(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const user = userRepository.findById(id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  req.user = user;
  next();
}

app.get("/users", (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;

    const users = userRepository.getAll(limit, offset);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/user/:id", validateUser, (req, res) => {
  res.json(req.user);
});

app.post("/users", (req, res, next) => {
  try {
    const newUser = userRepository.add(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

app.delete("/user/:id", validateUser, (req, res) => {
  try {
    const success = userRepository.remove(req.params.id);

    if (success) {
      return res.status(204).end();
    }

    res.status(500).json({ error: "Failed to delete user" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/upload", (req, res, next) => {
  try {
    const { fileName } = req.body;

    if (!fileName || !req.body.content) {
      return res
        .status(400)
        .json({ error: "File name and content are required" });
    }

    const safeName = path.basename(fileName).replace(/[^a-z0-9.]/gi, "_");
    const filePath = path.join(UPLOAD_DIR, safeName);

    fs.writeFile(filePath, req.body.content, (err) => {
      if (err) {
        return next(err);
      }
      res
        .status(201)
        .json({ message: "File uploaded successfully", path: safeName });
    });
  } catch (error) {
    next(error);
  }
});

app.post("/calculate", (req, res) => {
  try {
    const { a, b, operation } = req.body;

    if (typeof a !== "number" || typeof b !== "number") {
      return res.status(400).json({ error: "Numbers are required" });
    }

    let result;

    switch (operation) {
      case "add":
        result = a + b;
        break;
      case "subtract":
        result = a - b;
        break;
      case "multiply":
        result = a * b;
        break;
      case "divide":
        if (b === 0) {
          return res.status(400).json({ error: "Division by zero" });
        }
        result = a / b;
        break;
      default:
        return res.status(400).json({ error: "Invalid operation" });
    }

    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Calculation error" });
  }
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

module.exports = { app, server, UserRepository };
