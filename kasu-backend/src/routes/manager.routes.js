const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authMiddleware, managerMiddleware } = require('../middleware/auth.middleware');
const {
  categoryValidator,
  itemValidator,
  settingsValidator,
  taxValidator
} = require('../utils/validators');
const {
  getDashboardStats,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getItems,
  createItem,
  updateItem,
  deleteItem,
  getLiveOrders,
  getOrdersHistory,
  getAnalytics
} = require('../controllers/manager.controller');
const {
  getSettings,
  updateSettings,
  updateTax
} = require('../controllers/settings.controller');
const { getAllOrders } = require('../controllers/order.controller');

// Apply auth and manager middleware to all routes
router.use(authMiddleware, managerMiddleware);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Categories
router.get('/categories', getCategories);
router.post('/categories', categoryValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Items
router.get('/items', getItems);
router.post('/items', itemValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, createItem);
router.put('/items/:id', updateItem);
router.delete('/items/:id', deleteItem);

// Orders
router.get('/orders/live', getLiveOrders);
router.get('/orders/history', getOrdersHistory);
router.get('/orders/all', getAllOrders);

// Analytics
router.get('/analytics', getAnalytics);

// Settings
router.get('/settings', getSettings);
router.put('/settings', settingsValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, updateSettings);
router.put('/settings/tax', taxValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, updateTax);

module.exports = router;