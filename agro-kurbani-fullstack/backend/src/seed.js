require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Animal } = require('./models');

async function seed() {
  await sequelize.sync({ force: true }); // WARNING: drops and recreates all tables
  console.log('Tables recreated.');

  const password = await bcrypt.hash('password123', 10);

  const admin = await User.create({ name: 'Site Admin', email: 'admin@agrokurbani.com', password, role: 'admin' });
  const farmer1 = await User.create({ name: 'Abdul Karim', email: 'karim@farm.com', phone: '01711000001', password, role: 'farmer' });
  const farmer2 = await User.create({ name: 'Rafiqul Islam', email: 'rafiqul@farm.com', phone: '01711000002', password, role: 'farmer' });
  const customer1 = await User.create({ name: 'Nusrat Jahan', email: 'nusrat@example.com', phone: '01911000001', password, role: 'customer' });

  await Animal.bulkCreate([
    {
      farmer_id: farmer1.id, title: 'Boishakhi', category: 'Cow', breed: 'Bengal Cross', age: '2.5 yrs',
      weight: 420, farm_location: 'Savar, Dhaka', price_per_share: 8500, total_shares: 7, available_shares: 7,
      description: 'Grain-fed and healthy, raised on open pasture near Savar.', status: 'available',
    },
    {
      farmer_id: farmer1.id, title: 'Shonar Tori', category: 'Cow', breed: 'Holstein Mix', age: '3 yrs',
      weight: 480, farm_location: 'Savar, Dhaka', price_per_share: 9200, total_shares: 7, available_shares: 2,
      description: 'Large, well-muscled cow raised on a mixed grain diet.', status: 'available',
    },
    {
      farmer_id: farmer2.id, title: 'Kalobondhu', category: 'Goat', breed: 'Black Bengal', age: '14 months',
      weight: 32, farm_location: 'Mymensingh', price_per_share: 14500, total_shares: 1, available_shares: 1,
      description: 'Purebred Black Bengal goat, known for tender meat. Sold whole.', status: 'available',
    },
    {
      farmer_id: farmer2.id, title: 'Megh Raja', category: 'Sheep', breed: 'Garole', age: '18 months',
      weight: 44, farm_location: 'Pabna', price_per_share: 12800, total_shares: 1, available_shares: 1,
      description: 'Compact Garole sheep, sold as a whole animal.', status: 'available',
    },
  ]);

  console.log('Seed complete.');
  console.log('Login with any of these (password: password123):');
  console.log('  admin@agrokurbani.com (admin)');
  console.log('  karim@farm.com (farmer)');
  console.log('  rafiqul@farm.com (farmer)');
  console.log('  nusrat@example.com (customer)');

  await sequelize.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
