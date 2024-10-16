// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Import Routes
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the ToDo API");
});

// backend/server.js snippet

// Replace '*' with your frontend's origin in production
app.use(
  cors({
    origin: "http://localhost:5173", // Vite's default port
    optionsSuccessStatus: 200,
  })
);

const helmet = require("helmet");
app.use(helmet());

// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false, // Deprecated in Mongoose 6
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
