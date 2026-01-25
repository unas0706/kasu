const { body } = require('express-validator');

const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

const categoryValidator = [
  body('name').notEmpty().trim(),
  body('description').optional().trim(),
  body('isActive').optional().isBoolean()
];

const itemValidator = [
  body('name').notEmpty().trim(),
  body('category').notEmpty().isMongoId(),
  body('price').isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }),
  body('description').optional().trim(),
  body('isAvailable').optional().isBoolean()
];

const orderValidator = [
  body('customer.name').notEmpty().trim(),
  body('customer.phone').notEmpty().trim(),
  body('customer.email').optional().isEmail().normalizeEmail(),
  body('items').isArray({ min: 1 }),
  body('items.*.item').notEmpty().isMongoId(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('orderType').isIn(['dine-in', 'takeaway', 'delivery']),
  body('tableNumber').optional().trim(),
  body('seatNumber').optional().trim(),
  body('deliveryAddress').optional().trim(),
  body('notes').optional().trim(),
  body('paymentMethod').optional().isIn(['card', 'cash', 'mobile', 'online'])
];

const taxValidator = [
  body('taxPercentage').isFloat({ min: 0, max: 100 }),
  body('taxInclusive').optional().isBoolean()
];

const settingsValidator = [
  body('businessName').optional().trim(),
  body('address').optional().trim(),
  body('phone').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('currency').optional().trim(),
  body('timeZone').optional().trim(),
  body('dateFormat').optional().trim(),
  body('lowStockAlert').optional().isInt({ min: 1 }),
  body('autoRefreshOrders').optional().isBoolean(),
  body('autoRefreshInterval').optional().isInt({ min: 10 }),
  body('orderNotificationSound').optional().isBoolean()
];

module.exports = {
  loginValidator,
  categoryValidator,
  itemValidator,
  orderValidator,
  taxValidator,
  settingsValidator
};