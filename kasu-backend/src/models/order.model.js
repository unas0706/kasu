const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `ORD-${Date.now()}-${randomNum}`; // Added timestamp for better uniqueness
      },
    },
    customer: {
      // name: {
      //   type: String,
      //   required: true,
      // },
      phone: {
        type: String,
        required: true,
      },
      upiId: {
        type: String,
        default: "",
      },
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    taxRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 5.0,
    },
    taxAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    // status: {
    //   type: String,
    //   enum: [
    //     "pending",
    //     "accepted",
    //     "preparing",
    //     "ready",
    //     "completed",
    //     "declined",
    //     "cancelled",
    //   ],
    //   default: "pending",
    // },
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    // orderType: {
    //   type: String,
    //   enum: ["dine-in", "takeaway", "delivery"],
    //   required: true,
    // },
    screenNumber: {
      type: String,
      default: "",
    },
    seatNumber: {
      type: String,
      default: "",
    },
    seatRow: {
      type: String,
      default: "",
    },

    // deliveryAddress: {
    //   type: String,
    //   default: "",
    // },
    // notes: {
    //   type: String,
    //   default: "",
    // },
    whatsappNotificationSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Calculate totals before saving
orderSchema.pre("save", function (next) {
  if (this.isModified("items")) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    this.taxAmount = (this.subtotal * this.taxRate) / 100;
    this.total = this.subtotal + this.taxAmount;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
