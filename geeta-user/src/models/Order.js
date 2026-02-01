// src/models/Order.js - Add seat price to the model
export class Order {
  constructor(data = {}) {
    this.orderId = data.orderId;
    this.customer = {
      name: data.customer?.name || "",
      email: data.customer?.email || "",
      phone: data.customer?.phone || "",
      address: data.customer?.address || "",
      phone: data.customer?.phone || "",
      upiId: data.customer?.upiId || "",
    };
    this.items = data.items || [];
    this.subtotal = data.subtotal || 0;
    this.taxRate = data.taxRate || 5;
    this.taxAmount = data.taxAmount || 0;
    this.total = data.total || 0;
    this.status = data.status || "pending";
    this.paymentMethod = data.paymentMethod || "upi";
    this.paymentStatus = data.paymentStatus || "pending";
    this.screenNumber = data.screenNumber || "";
    this.screenType = data.screenType || "";
    this.seatNumber = data.seatNumber || "";
    this.seatRow = data.seatRow || "";
    this.seatType = data.seatType || "";
    this.seatPriceMultiplier = data.seatPriceMultiplier || 1.0;
    this.notes = data.notes || "";
    this.transactionId = data.transactionId || "";
    this.whatsappNotificationSent = data.whatsappNotificationSent || false;
  }

  calculateTotals() {
    this.subtotal = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    this.taxAmount = (this.subtotal * this.taxRate) / 100;
    this.total = this.subtotal + this.taxAmount;
  }

  addItem(item, quantity = 1) {
    const existingItem = this.items.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        ...item,
        quantity,
        subtotal: item.price * quantity,
      });
    }
    this.calculateTotals();
  }

  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
    this.calculateTotals();
  }

  updateItemQuantity(itemId, quantity) {
    const item = this.items.find((i) => i.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        item.subtotal = item.price * quantity;
        this.calculateTotals();
      }
    }
  }

  setSeatDetails(screen, seatRow, seatNumber, seatType, priceMultiplier) {
    this.screenNumber = screen.name;
    this.screenType = screen.type;
    this.seatRow = seatRow;
    this.seatNumber = seatNumber;
    this.seatType = seatType;
    this.seatPriceMultiplier = priceMultiplier;
  }

  clear() {
    this.items = [];
    this.subtotal = 0;
    this.taxAmount = 0;
    this.total = 0;
    this.seatNumber = "";
    this.seatRow = "";
    this.seatType = "";
    this.seatPriceMultiplier = 1.0;
  }
}
