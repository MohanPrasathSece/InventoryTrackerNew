const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

// Get all suppliers with optional search and filter
router.get('/', async (req, res) => {
  try {
    const { search, filter } = req.query;
    let query = {};

    if (search) {
      query.supplierName = { $regex: search, $options: 'i' };
    }

    if (filter) {
      query.supplyProducts = { $regex: filter, $options: 'i' };
    }

    const suppliers = await Supplier.find(query);
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
  }
});

// Get supplier count
router.get('/count', async (req, res) => {
  try {
    const count = await Supplier.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error('Error fetching supplier count:', err);
    res.status(500).json({ message: 'Error fetching supplier count', error: err.message });
  }
});

// Get a single supplier by ID
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ message: 'Error fetching supplier', error: error.message });
  }
});

// Create a new supplier
router.post('/', async (req, res) => {
  try {
    const { supplierName, email, phone } = req.body;

    // Validate required fields
    if (!supplierName || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if supplier with same email already exists
    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res.status(400).json({ message: 'Supplier with this email already exists' });
    }

    const supplier = new Supplier({
      supplierName,
      email,
      phone
    });

    const savedSupplier = await supplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ message: 'Error creating supplier', error: error.message });
  }
});

// Update a supplier by ID
router.put('/:id', async (req, res) => {
  try {
    const { supplierName, email, phone } = req.body;
    
    // Check if supplier exists
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== supplier.email) {
      const existingSupplier = await Supplier.findOne({ email });
      if (existingSupplier) {
        return res.status(400).json({ message: 'Email already in use by another supplier' });
      }
    }

    // Update fields
    if (supplierName) supplier.supplierName = supplierName;
    if (email) supplier.email = email;
    if (phone) supplier.phone = phone;

    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ message: 'Error updating supplier', error: error.message });
  }
});

// Delete a supplier by ID
router.delete('/:id', async (req, res) => {
  try {
    // Check if supplier has associated products
    const hasProducts = await Product.exists({ supplier: req.params.id });
    if (hasProducts) {
      return res.status(400).json({ 
        message: 'Cannot delete supplier with associated products. Please delete the products first.' 
      });
    }

    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    await supplier.deleteOne();
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: 'Error deleting supplier', error: error.message });
  }
});

module.exports = router;
