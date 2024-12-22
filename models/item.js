const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Elektronik', 'Pakaian', 'Makanan', 'Lainnya'], required: true },
  quantity: { type: Number, required: true, min: 1 },
  pricePerUnit: { type: Number, required: true, min: 100 },
  dateAdded: { 
    type: Date, 
    required: true
    
  },
});

module.exports = mongoose.model('Item', itemSchema);
