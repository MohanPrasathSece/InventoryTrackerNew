const mongoose = require('mongoose');
const Supplier = require('../models/Supplier');

const MONGODB_URI = 'mongodb+srv://mohanprasath:0110@cluster0.4gcqj.mongodb.net/inventory-management?retryWrites=true&w=majority';

const createTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create a test supplier
    const testSupplier = new Supplier({
      supplierName: 'Test Supplier',
      email: 'test@supplier.com',
      phone: '1234567890'
    });

    await testSupplier.save();
    console.log('Test supplier created:', testSupplier);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestData();
