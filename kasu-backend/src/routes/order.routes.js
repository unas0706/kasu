const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authMiddleware, managerMiddleware } = require('../middleware/auth.middleware');
const { orderValidator } = require('../utils/validators');
const {
  createOrder,
  updateOrderStatus,
  getCustomerOrder,
  getAllOrders
} = require('../controllers/order.controller');

// Public routes (customer orders)
router.post('/', orderValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, createOrder);
router.get('/track', getCustomerOrder);

// Protected routes (manager operations)
router.put('/:orderId/status', authMiddleware, managerMiddleware, updateOrderStatus);

module.exports = router;