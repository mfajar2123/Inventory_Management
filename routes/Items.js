const express = require('express');
const Item = require('../models/item');
const router = express.Router();

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get item by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).send({ error: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
});

// Add new item
router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, pricePerUnit, dateAdded } = req.body;

    if (!name || !category || !quantity || !pricePerUnit || !dateAdded) {
      return res.status(400).json({ error: 'Semua field harus diisi' });
    }
  
    const newItem = new Item({ name, category, quantity, pricePerUnit, dateAdded });
    await newItem.save();

    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan saat menyimpan data' });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).send({ error: 'Item not found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).send({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
