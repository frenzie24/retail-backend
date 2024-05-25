const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
const {log, error} = require('@frenzie24/logger')
// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    log(`Getting all tags:`, 'blue');
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

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    log(`Getting all tags:`, 'blue');
    /* 
    find a single product by its `id`  and joins with category and Tag, 
    Category model and Product model share a foreign key
    Product relates to Tag through ProductTag (product_id, and tag_id)
    */
    const tags = await Tag.findByPk(req.params.id, { include: [{ model: Product, through: ProductTag }] });
    if (!tags) {
      warn('We had an issue getting tags.');
      res.status(404).json({ msg: 'there was an issue getting all tags' });
    }
    res.status(200).json(tags);
  } catch (e) {
    // if we have an error, have logger print a formatted error;
    error(e);
    res.status(500), json(e);
  }
});

router.post('/', (req, res) => {
  // create a new tag
  log(['req.body:', req.body]);

  Tag.create(req.body)
    .then((tag) => {
      
      // if no product tags, just respond
      res.status(200).json(tag);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
   // update a category by its `id` value
   log('trying to update a category', 'red')
   Tag.update(req.body, {
     where: {
       id: req.params.id,
     },
   })
     .then((tag) => {
      
       log('it worked', 'green')
       return res.json(tag);
     })
     .catch((err) => {
       // console.log(err);
       res.status(400).json(err);
     });
});

router.delete('/:id', async (req, res) => {
  await Tag.destroy({where: {id: req.params.id}});
  res.status(200).json({msg:' tag deleted'})
  // delete on tag by its `id` value
});

module.exports = router;
