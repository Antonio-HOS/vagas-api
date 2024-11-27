const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const { authenticateToken } = require('./middlewares/authenticateToken');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch(err => {
  console.error('Unable to synchronize the database:', err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



