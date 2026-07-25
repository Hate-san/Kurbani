require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // In production, prefer migrations over sync(). This is convenient for
    // local dev / first run: it creates tables that don't exist yet.
    await sequelize.sync();
    console.log('Models synced.');

    app.listen(PORT, () => console.log(`Agro Kurbani API listening on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
