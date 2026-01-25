const express = require('express');
const router = express.Router();
const {
  getMenu,
  getAvailableSeats,
  getRestaurantInfo
} = require('../controllers/customer.controller');

// Public routes
router.get('/menu', getMenu);
router.get('/seats', getAvailableSeats);
router.get('/info', getRestaurantInfo);

module.exports = router;