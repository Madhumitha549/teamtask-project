const { Sequelize } = require('sequelize');

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('PASTE_YOUR')) {
  console.error('ERROR: Set a real DATABASE_URL in server/.env (Neon or local Postgres).');
  process.exit(1);
}

// Neon/cloud Postgres needs SSL; local Postgres usually does not.
const isLocal = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: isLocal ? {} : { ssl: { require: true, rejectUnauthorized: false } },
});

module.exports = sequelize;
