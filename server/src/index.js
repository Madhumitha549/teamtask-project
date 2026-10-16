require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is missing in server/.env');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => sequelize.sync({ alter: true }))
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch((e) => {
    console.error('DB connection failed:', e.message);
    process.exit(1);
  });