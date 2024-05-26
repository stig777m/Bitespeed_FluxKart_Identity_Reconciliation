const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const contactRoutes = require('./routes/contactRoutes');
const { sequelize } = require('./models'); // Import Sequelize instance

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/contacts', contactRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js API');
});

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server after ensuring database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
