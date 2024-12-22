require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const itemsRoutes = require('./routes/items');
app.use('/api/items', itemsRoutes);

// Serve Frontend
const path = require('path');
app.use(express.static(path.join(__dirname, 'views')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
