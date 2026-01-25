const Settings = require('../models/settings.model');
const Tax = require('../models/tax.model');

// Get all settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // If no settings exist, create default
    if (!settings) {
      settings = await Settings.create({});
    }
    
    const tax = await Tax.findOne().sort({ updatedAt: -1 });
    
    res.json({
      settings,
      tax: tax || { taxPercentage: 5.0, taxInclusive: false }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get settings', error: error.message });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        req.body,
        { new: true, runValidators: true, upsert: true }
      );
    }
    
    res.json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
};

// Update tax configuration
const updateTax = async (req, res) => {
  try {
    const tax = await Tax.create({
      ...req.body,
      updatedBy: req.user._id
    });
    
    res.json({
      message: 'Tax configuration updated successfully',
      tax
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update tax configuration', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  updateTax
};