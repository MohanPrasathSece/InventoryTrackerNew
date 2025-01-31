const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const supplierRoutes = require('./routes/supplierRoutes');
const salesRoutes = require('./routes/salesRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const productRoutes = require('./routes/productRoutes');
const dbStatusRoutes = require('./routes/dbStatus');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(bodyParser.json());

const connectWithRetry = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'inventory-management',
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 1000,
      });

  console.log('MongoDB connected successfully');
console.log('Database:', mongoose.connection.name);
console.log('Host:', mongoose.connection.host);

const db = mongoose.connection.db;
 const collections = await db.listCollections().toArray();

 const collectionNames = collections.map(col => col.name);
 console.log('Existing collections:', collectionNames);

 const requiredCollections = ['suppliers', 'products', 'orders', 'sales', 'users'];
     for (const collection of requiredCollections) {
 if (!collectionNames.includes(collection)) {
          await db.createCollection(collection);
          console.log(`Created collection: ${collection}`);
        }
      }
  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));
      mongoose.connection.on('disconnected', () => {
console.log('MongoDB disconnected. Retrying...');
        setTimeout(connectWithRetry, 5000);
      });

      return;
    } catch (error) {
      retries++;
      console.error(`MongoDB connection failed (attempt ${retries}):`, error.message);

      if (retries >= maxRetries) {
        console.error('Exceeded maximum retries. Exiting...');
        process.exit(1);
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

connectWithRetry();

app.get('/api/test-db', async (req, res) => {
  try {
    const connectionState = mongoose.connection.readyState;
    const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

    let stats = null, collections = [];
    if (connectionState === 1) {
      const db = mongoose.connection.db;
      stats = await db.stats();
      collections = await db.listCollections().toArray();
    }

    res.json({
      connected: connectionState === 1,
      connectionState: stateMap[connectionState],
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      stats,
      collections: collections.map(col => col.name)
    });
  } catch (error) {
    console.error('Error in /api/test-db:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.use('/api/suppliers', supplierRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/db-status', dbStatusRoutes);

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  res.json({ success: true, message: 'Login successful', token: `dummy-token-${Date.now()}` });
});

app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  res.json({ success: true, message: 'Account created', token: `dummy-token-${Date.now()}` });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

const orderSchema = new mongoose.Schema({
  customerName: String,
  productName: String,
  quantity: Number,
  price: Number,
});

const Order = mongoose.model('Order', orderSchema);

app.post('/api/orders', async (req, res) => {
  const { customerName, productName, quantity, price } = req.body;

  try {
    const newOrder = new Order({ customerName, productName, quantity, price });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    Object.assign(order, req.body);
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
