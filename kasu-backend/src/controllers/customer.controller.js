const Category = require('../models/category.model');
const Item = require('../models/item.model');
const Settings = require('../models/settings.model');
const Tax = require('../models/tax.model');

// Get all active categories and items
const getMenu = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 });
    
    const items = await Item.find({ 
      isAvailable: true,
      stock: { $gt: 0 }
    })
    .populate('category', 'name')
    .sort({ name: 1 });
    
    // Get tax configuration
    const taxConfig = await Tax.findOne().sort({ updatedAt: -1 });
    
    // Group items by category for easier display
    const menuByCategory = {};
    categories.forEach(category => {
      menuByCategory[category.name] = items.filter(item => 
        item.category && item.category.name === category.name
      );
    });
    
    // Get uncategorized items
    const uncategorizedItems = items.filter(item => !item.category);
    if (uncategorizedItems.length > 0) {
      menuByCategory['Other'] = uncategorizedItems;
    }
    
    res.json({
      categories,
      items,
      menuByCategory,
      taxRate: taxConfig?.taxPercentage || 5.0
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get menu', error: error.message });
  }
};

// Get available seats (for dine-in)
const getAvailableSeats = async (req, res) => {
  try {
    // This is a simplified version. In a real app, you'd track seat availability
    // based on current orders and restaurant layout
    
    const seats = [];
    const tables = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerTable = 4;
    
    tables.forEach(table => {
      for (let i = 1; i <= seatsPerTable; i++) {
        seats.push({
          table: table,
          seat: i.toString(),
          label: `Table ${table}, Seat ${i}`
        });
      }
    });
    
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get available seats', error: error.message });
  }
};

// Get restaurant info
const getRestaurantInfo = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const taxConfig = await Tax.findOne().sort({ updatedAt: -1 });
    
    if (!settings) {
      return res.status(404).json({ message: 'Restaurant information not found' });
    }
    
    res.json({
      name: settings.businessName,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      businessHours: settings.businessHours,
      taxRate: taxConfig?.taxPercentage || 5.0
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get restaurant info', error: error.message });
  }
};

module.exports = {
  getMenu,
  getAvailableSeats,
  getRestaurantInfo
};