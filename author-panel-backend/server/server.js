const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const articleRoutes = require("./routes/articleRoutes");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/articles", articleRoutes); // ✅ use only this

// Error Handling
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
