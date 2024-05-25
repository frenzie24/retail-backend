// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  through: {model: Category, as: 'category_name'}
})
// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id'
})
// Products belongToMany Tags (through ProductTag)


Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id' // You need to specify the foreign key here
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id' // You need to specify the foreign key here
});



module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
