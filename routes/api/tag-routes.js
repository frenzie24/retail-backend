const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
const {log, error} = require('@frenzie24/logger')
// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    log(`Getting all products:`, 'blue');
    const tags = await Tag.findAll({ include: [{ model: Product, through: ProductTag }] });
    if (!tags) {
      warn('We had an issue getting products.');
      res.status(404).json({ msg: 'there was an issue getting all products' });
    }
    res.status(200).json(tags);
  } catch (e) {
    // if we have an error, have logger print a formatted error;
    error(e);
    res.status(500).json(e);
  }
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
