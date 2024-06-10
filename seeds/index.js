const seedCategories = require('./category-seeds');
const seedProducts = require('./product-seeds');
const seedTags = require('./tag-seeds');
const seedProductTags = require('./product-tag-seeds');

const sequelize = require('../config/connection');
const {log} = require('@frenzie24/logger');
const seedAll = async () => {
  await sequelize.sync({ force: true });
  log('\n----- DATABASE SYNCED -----\n', 'green');
  await seedCategories();
  log('\n----- CATEGORIES SEEDED -----\n',  'green');

  await seedProducts();
  log('\n----- PRODUCTS SEEDED -----\n',  'green');

  await seedTags();
  log('\n----- TAGS SEEDED -----\n',  'green');

  await seedProductTags();
  log('\n----- PRODUCT TAGS SEEDED -----\n', 'green');

  process.exit(0);
};

seedAll();
