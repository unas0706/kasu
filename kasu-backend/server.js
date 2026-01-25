const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require("./src/routes/auth.routes");
const managerRoutes = require("./src/routes/manager.routes");
const customerRoutes = require("./src/routes/customer.routes");
const orderRoutes = require("./src/routes/order.routes");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/orders", orderRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Food Ordering System API",
    endpoints: {
      manager: "/manager",
      customer: "/customer",
      api: {
        auth: "/api/auth",
        manager: "/api/manager",
        customer: "/api/customer",
        orders: "/api/orders",
      },
    },
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Socket.io for live orders
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join-manager-room", () => {
    socket.join("managers");
    console.log("Manager joined room");
  });

  socket.on("join-customer-room", (orderId) => {
    socket.join(`customer-${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Make io accessible to routes
app.set("socketio", io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
