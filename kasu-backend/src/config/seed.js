// seed.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const Category = require("../models/category.model");
const Item = require("../models/item.model");
const Settings = require("../models/settings.model");
const Tax = require("../models/tax.model");
const Order = require("../models/order.model");

mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://unas:0706@cluster0.c4ugsxt.mongodb.net/?appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const seedDatabase = async () => {
  try {
    console.log("Seeding database...");

    await User.deleteMany({});
    await Category.deleteMany({});
    await Item.deleteMany({});
    await Settings.deleteMany({});
    await Tax.deleteMany({});
    await Order.deleteMany({});

    // Users
    const adminUser = await User.create({
      name: "unas",
      email: "unas@gmail.com.com",
      password: 1234,
      role: "admin",
      phone: "1234567890",
      isActive: true,
    });

    const managerUser = await User.create({
      name: "unas",
      email: "unas@gmail.com",
      password: 1234,
      role: "manager",
      phone: "0987654321",
      address: "Kasu Mall",
      avatar: "UA",
      isActive: true,
    });

    // Categories
    const categories = await Category.create([
      {
        name: "Popcorn",
        description: "Fresh popcorn",
        isActive: true,
        createdBy: managerUser._id,
      },
      {
        name: "Soft Drinks",
        description: "Beverages",
        isActive: true,
        createdBy: managerUser._id,
      },
      {
        name: "Desserts",
        description: "Sweet treats",
        isActive: true,
        createdBy: managerUser._id,
      },
      {
        name: "Snacks",
        description: "Quick bites",
        isActive: true,
        createdBy: managerUser._id,
      },
      {
        name: "Combo Meals",
        description: "Combo offers",
        isActive: true,
        createdBy: managerUser._id,
      },
      {
        name: "New",
        description: "new category",
        isActive: true,
        createdBy: managerUser._id,
      },
    ]);

    // Items
    const items = await Item.create([
      {
        name: "Classic Popcorn (Large)",
        category: categories[0]._id,
        description: "Butter popcorn",
        price: 8.99,
        cost: 2.5,
        stock: 50,
        isAvailable: true,
        createdBy: managerUser._id,
      },
      {
        name: "Caramel Popcorn",
        category: categories[0]._id,
        description: "Caramel flavor",
        price: 6.99,
        cost: 2.0,
        stock: 40,
        isAvailable: true,
        createdBy: managerUser._id,
      },
      {
        name: "Coca-Cola",
        category: categories[1]._id,
        description: "500ml bottle",
        price: 3.5,
        cost: 1.0,
        stock: 100,
        isAvailable: true,
        createdBy: managerUser._id,
      },
      {
        name: "Chocolate Brownie",
        category: categories[2]._id,
        description: "Chocolate brownie",
        price: 5.99,
        cost: 1.5,
        stock: 30,
        isAvailable: true,
        createdBy: managerUser._id,
      },
    ]);

    // Helpers
    const randomDate = () => {
      const now = new Date();
      const past = new Date(now);
      past.setDate(now.getDate() - Math.floor(Math.random() * 7));
      return past;
    };

    const generateOrderId = () => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      return `ORD-${randomNum}`;
    };

    const createOrderItems = () => {
      const selected = [
        items[Math.floor(Math.random() * items.length)],
        items[Math.floor(Math.random() * items.length)],
      ];

      return selected.map((item) => {
        const qty = Math.floor(Math.random() * 3) + 1;
        return {
          item: item._id,
          name: item.name,
          price: item.price,
          quantity: qty,
          subtotal: item.price * qty,
        };
      });
    };

    // Orders
    const orders = [];

    for (let i = 0; i < 25; i++) {
      const orderItems = createOrderItems();
      const subtotal = orderItems.reduce((s, it) => s + it.subtotal, 0);
      const taxRate = 5;
      const taxAmount = (subtotal * taxRate) / 100;
      const total = subtotal + taxAmount;

      orders.push({
        orderId: generateOrderId(),
        customer: {
          name: `Customer ${i + 1}`,
          email: `customer${i + 1}@mail.com`,
          phone: `90000000${i}`,
          address: "Narasaraopet",
        },
        items: orderItems,
        subtotal,
        taxRate,
        taxAmount,
        total,
        status: [
          "pending",
          "accepted",
          "preparing",
          "ready",
          "completed",
          "declined",
        ][Math.floor(Math.random() * 6)],
        paymentMethod: ["cash", "card", "online"][
          Math.floor(Math.random() * 3)
        ],
        paymentStatus: ["pending", "paid"][Math.floor(Math.random() * 2)],
        orderType: ["dine-in", "takeaway", "delivery"][
          Math.floor(Math.random() * 3)
        ],
        tableNumber:
          Math.random() > 0.5 ? `${Math.floor(Math.random() * 10)}` : "",
        deliveryAddress: Math.random() > 0.5 ? "Palnadu Area" : "",
        notes: "Seeded order",
        createdAt: randomDate(),
        updatedAt: randomDate(),
      });
    }

    await Order.insertMany(orders);
    console.log("Orders history seeded!");

    // Settings
    await Settings.create({
      businessName: "KASU GEETA ARTS",
      address: "Palnadu Bustand, Narasaraopet",
      phone: "0987654321",
      email: "unas@gmail.com",
      currency: "INR",
      timeZone: "India/Kolkata",
      dateFormat: "DD/MM/YYYY",
      lowStockAlert: 10,
      autoRefreshOrders: true,
      autoRefreshInterval: 30,
      orderNotificationSound: true,
    });

    // Tax
    await Tax.create({
      taxPercentage: 5.0,
      taxInclusive: false,
      updatedBy: managerUser._id,
    });

    console.log("Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDatabase();
