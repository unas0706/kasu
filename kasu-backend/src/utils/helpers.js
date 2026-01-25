const { format } = require('date-fns');

const generateOrderId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${randomNum}`;
};

const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const calculateOrderSummary = (items, taxPercentage = 5.0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = (subtotal * taxPercentage) / 100;
  const total = subtotal + taxAmount;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    taxRate: taxPercentage
  };
};

const sendWhatsAppMessage = async (phone, message) => {
  // This is a placeholder for WhatsApp integration
  // In production, integrate with Twilio or WhatsApp Business API
  console.log(`WhatsApp message to ${phone}: ${message}`);
  
  // Example with Twilio:
  /*
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  try {
    const message = await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
      to: `whatsapp:${phone}`
    });
    return message.sid;
  } catch (error) {
    console.error('WhatsApp message error:', error);
    return null;
  }
  */
  
  return true;
};

const sendOrderConfirmation = async (order, settings) => {
  const message = `
🎉 Order Confirmation - ${settings.businessName}

Order ID: ${order.orderId}
Date: ${format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
Status: ${order.status.toUpperCase()}

📦 Items:
${order.items.map(item => `  ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

💰 Order Summary:
Subtotal: $${order.subtotal.toFixed(2)}
Tax (${order.taxRate}%): $${order.taxAmount.toFixed(2)}
Total: $${order.total.toFixed(2)}

📍 ${order.orderType === 'dine-in' ? `Table: ${order.tableNumber}, Seat: ${order.seatNumber}` : 
    order.orderType === 'delivery' ? `Delivery to: ${order.deliveryAddress}` : 'Takeaway'}

Thank you for your order! 🍔
  `;
  
  return await sendWhatsAppMessage(order.customer.phone, message);
};

module.exports = {
  generateOrderId,
  formatCurrency,
  calculateOrderSummary,
  sendWhatsAppMessage,
  sendOrderConfirmation
};