const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const supplierSchema = new mongoose.Schema({
  supplierName: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Apply the unique validator plugin
supplierSchema.plugin(uniqueValidator, { message: '{PATH} already exists.' });

// Add indexes for better query performance
supplierSchema.index({ supplierName: 1 });
supplierSchema.index({ email: 1 }, { unique: true });

// Pre-save middleware to format phone number
supplierSchema.pre('save', function(next) {
  // Remove any non-digit characters from phone number
  if (this.phone) {
    this.phone = this.phone.replace(/\D/g, '');
  }
  next();
});

// Virtual for products
supplierSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'supplier'
});

module.exports = mongoose.model('Supplier', supplierSchema);
