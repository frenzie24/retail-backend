const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
const { log, error, warn, info } = require('@frenzie24/logger');
log('hello world?', 'green');
// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  /* 
  find all products and joins with category and Tag, 
  Category model and Product model share a foreign key
  Product relates to Tag through ProductTag (product_id, and tag_id)
  */
  try {
    log(`Getting all products:`, 'blue');
    const products = await Product.findAll({ include: [{ model: Category }, { model: Tag, through: ProductTag }] });
    if (!products) {
      warn('We had an issue getting products.');
      res.status(404).json({ msg: 'there was an issue getting all products' });
    }
    res.status(200).json(products);
  } catch (e) {
    // if we have an error, have logger print a formatted error;
    error(e);
    res.status(500).json(e);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    log(`Getting all products:`, 'blue');
    /* 
    find a single product by its `id`  and joins with category and Tag, 
    Category model and Product model share a foreign key
    Product relates to Tag through ProductTag (product_id, and tag_id)
    */
    const product = await Product.findByPk(req.params.id, { include: [{ model: Category }, { model: Tag, through: ProductTag }] });
    if (!product) {
      warn(`there was an issue getting product id#: ${req.params.id}`);
      res.status(404).json({ msg: `there was an issue getting product id#: ${req.params.id}` });
    }
    res.status(200).json(product);
  } catch (e) {
    // if we have an error, have logger print a formatted error;
    error(e);
    res.status(500), json(e);
  }

  // be sure to include its associated Category and Tag data
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      "product_name": "Basketball",
      "price": "200.00",
      "stock": "3",
      "tagIds": "[1, 2, 3, 4]""
    }
  */

  log(['req.body:', req.body]);

  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  log('trying to update a product', 'red')
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
 await Product.destroy({where: {id: req.params.id}});
 res.status(200).json({msg:' Product deleted'})
  // delete one product by its `id` value
});

module.exports = router;
