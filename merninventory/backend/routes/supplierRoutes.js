const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const ExcelJS = require('exceljs');

// Get all suppliers with optional search and filter
router.get('/', async (req, res) => {
  try {
    const { search, filter } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { supplierName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { supplyProducts: { $regex: search, $options: 'i' } }
        ]
      };
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

// Generate supplier report
router.get('/report', async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Suppliers Report');
    
    // Add headers
    worksheet.columns = [
      { header: 'Supplier Name', key: 'supplierName', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Supply Products', key: 'supplyProducts', width: 30 },
      { header: 'Payment Terms', key: 'paymentTerms', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 20 }
    ];
    
    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Add data rows
    suppliers.forEach(supplier => {
      worksheet.addRow({
        supplierName: supplier.supplierName,
        email: supplier.email,
        phone: supplier.phone,
        supplyProducts: supplier.supplyProducts,
        paymentTerms: supplier.paymentTerms,
        createdAt: supplier.createdAt.toLocaleDateString()
      });
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=suppliers-report.xlsx');
    
    // Write to response
    await workbook.xlsx.write(res);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
