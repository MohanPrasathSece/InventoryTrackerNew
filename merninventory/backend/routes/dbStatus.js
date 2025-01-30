const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

// Get database status and collection counts
router.get('/', async (req, res) => {
  try {
    const dbStatus = {
      connected: mongoose.connection.readyState === 1,
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      collections: {
        suppliers: await Supplier.countDocuments(),
        products: await Product.countDocuments()
      }
    };
    res.json(dbStatus);
  } catch (error) {
    console.error('Database status error:', error);
    res.status(500).json({ 
      error: 'Error getting database status',
      details: error.message 
    });
  }
});

module.exports = router;
