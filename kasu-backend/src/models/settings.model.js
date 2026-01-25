const mongoose = require("mongoose");

const businessHoursSchema = new mongoose.Schema({
  open: {
    type: String,
    required: true,
  },
  close: {
    type: String,
    required: true,
  },
});

const settingsSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      default: "FoodFlow Restaurant",
    },
    address: {
      type: String,
      required: true,
      default: "123 Main Street, San Francisco, CA 94107",
    },
    phone: {
      type: String,
      required: true,
      default: "+1 (555) 123-4567",
    },
    email: {
      type: String,
      required: true,
      default: "info@foodflow.com",
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
    },
    timeZone: {
      type: String,
      required: true,
      default: "America/Los_Angeles",
    },
    dateFormat: {
      type: String,
      required: true,
      default: "DD/MM/YYYY",
    },
    businessHours: {
      monday: businessHoursSchema,
      tuesday: businessHoursSchema,
      wednesday: businessHoursSchema,
      thursday: businessHoursSchema,
      friday: businessHoursSchema,
      saturday: businessHoursSchema,
      sunday: businessHoursSchema,
    },
    lowStockAlert: {
      type: Number,
      required: true,
      min: 1,
      default: 10,
    },
    autoRefreshOrders: {
      type: Boolean,
      default: true,
    },
    autoRefreshInterval: {
      type: Number,
      min: 10,
      default: 30,
    },
    orderNotificationSound: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Set default business hours
settingsSchema.pre("save", function (next) {
  if (!this.businessHours.monday) {
    this.businessHours = {
      monday: { open: "9:00", close: "22:00" },
      tuesday: { open: "9:00", close: "22:00" },
      wednesday: { open: "9:00", close: "22:00" },
      thursday: { open: "9:00", close: "22:00" },
      friday: { open: "9:00", close: "23:00" },
      saturday: { open: "10:00", close: "23:00" },
      sunday: { open: "10:00", close: "21:00" },
    };
  }
  next();
});

module.exports = mongoose.model("Settings", settingsSchema);
