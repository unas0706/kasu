const Order = require('../models/order.model');
const Item = require('../models/item.model');
const Settings = require('../models/settings.model');
const Tax = require('../models/tax.model');
const { sendOrderConfirmation } = require('../utils/helpers');

// Create new order (customer)
const createOrder = async (req, res) => {
  try {
    const { items, customer, orderType, tableNumber, seatNumber, deliveryAddress, notes, paymentMethod } = req.body;
    
    // Get tax configuration
    const taxConfig = await Tax.findOne().sort({ updatedAt: -1 });
    const taxPercentage = taxConfig?.taxPercentage || 5.0;
    
    // Validate and prepare order items
    const orderItems = [];
    let subtotal = 0;
    
    for (const item of items) {
      const itemDoc = await Item.findById(item.item);
      
      if (!itemDoc) {
        return res.status(404).json({ message: `Item ${item.item} not found` });
      }
      
      if (!itemDoc.isAvailable) {
        return res.status(400).json({ message: `Item ${itemDoc.name} is not available` });
      }
      
      if (itemDoc.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${itemDoc.name}. Available: ${itemDoc.stock}, Requested: ${item.quantity}` 
        });
      }
      
      const itemSubtotal = itemDoc.price * item.quantity;
      subtotal += itemSubtotal;
      
      orderItems.push({
        item: itemDoc._id,
        name: itemDoc.name,
        price: itemDoc.price,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });
      
      // Update stock
      itemDoc.stock -= item.quantity;
      await itemDoc.save();
    }
    
    // Calculate tax and total
    const taxAmount = (subtotal * taxPercentage) / 100;
    const total = subtotal + taxAmount;
    
    // Create order
    const order = new Order({
      customer,
      items: orderItems,
      subtotal,
      taxRate: taxPercentage,
      taxAmount,
      total,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : '',
      seatNumber: orderType === 'dine-in' ? seatNumber : '',
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : '',
      notes,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid'
    });
    
    await order.save();
    
    // Get settings for WhatsApp message
    const settings = await Settings.findOne();
    
    // Send WhatsApp confirmation
    await sendOrderConfirmation(order, settings);
    
    // Emit socket event for live orders
    const io = req.app.get('socketio');
    io.to('managers').emit('new-order', order);
    
    res.status(201).json({
      message: 'Order created successfully',
      order,
      whatsappSent: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// Update order status (manager)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true, runValidators: true }
    ).populate('items.item', 'name');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Emit socket event for status update
    const io = req.app.get('socketio');
    io.to('managers').emit('order-updated', order);
    io.to(`customer-${order.orderId}`).emit('order-status-updated', order);
    
    // If order is completed, send WhatsApp confirmation
    if (status === 'completed' && !order.whatsappNotificationSent) {
      const settings = await Settings.findOne();
      await sendOrderConfirmation(order, settings);
      order.whatsappNotificationSent = true;
      await order.save();
    }
    
    res.json({
      message: `Order ${orderId} status updated to ${status}`,
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

// Get customer order by ID
const getCustomerOrder = async (req, res) => {
  try {
    const { orderId, phone } = req.query;
    
    const order = await Order.findOne({ 
      orderId,
      'customer.phone': phone 
    }).populate('items.item', 'name');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get order', error: error.message });
  }
};

// Get all orders for manager
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.item', 'name')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get orders', error: error.message });
  }
};

module.exports = {
  createOrder,
  updateOrderStatus,
  getCustomerOrder,
  getAllOrders
};