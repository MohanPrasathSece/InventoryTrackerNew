const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const ExcelJS = require('exceljs');

// Get all products with search and filter
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { productName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    
    const products = await Product.find(query).populate('supplier', 'supplierName email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate product report
router.get('/report', async (req, res) => {
  try {
    const products = await Product.find({}).populate('supplier', 'supplierName');
    
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products Report');
    
    // Add headers
    worksheet.columns = [
      { header: 'Product Name', key: 'productName', width: 20 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Price', key: 'price', width: 12 },
      { header: 'Quantity', key: 'quantity', width: 12 },
      { header: 'Supplier', key: 'supplier', width: 20 },
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
    products.forEach(product => {
      worksheet.addRow({
        productName: product.productName,
        description: product.description,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        supplier: product.supplier.supplierName,
        createdAt: product.createdAt.toLocaleDateString()
      });
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=products-report.xlsx');
    
    // Write to response
    await workbook.xlsx.write(res);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new product
router.post('/', async (req, res) => {
  try {
    const product = new Product({
      productName: req.body.productName,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      supplier: req.body.supplier
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
