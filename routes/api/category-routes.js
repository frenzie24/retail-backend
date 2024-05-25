const router = require('express').Router();
const { Category, Product } = require('../../models');
const {log, error} = require('@frenzie24/logger');
// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  
  try {
    log(`Getting all products:`, 'blue');
    const categories = await Category.findAll({ include: [{ model: Product }]});//, { model: Tag, through: ProductTag }] });
    if (!categories) {
      warn('We had an issue getting categories.');
      res.status(404).json({ msg: 'there was an issue getting all categories' });
    }
    res.status(200).json(categories);
  } catch (e) {
    // if we have an error, have logger print a formatted error;
    error(e);
    res.status(500), json(e);
  }
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
