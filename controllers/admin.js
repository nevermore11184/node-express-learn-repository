const get = require('lodash/get');
const Product = require('../models/product');

exports.getAddProductPage = (request, response) => {
  response.render('admin/add-product', {
    pageTitle: 'Add a product',
    path: '/admin/add-product',
  });
};

exports.getEditProduct = (request, response) => {
  const editMode = get(request, 'query.edit');

  const prodId = get(request, 'params.productId');

  /** will find only one product */
  Product.findById(prodId).then(product => {
    response.render('admin/edit-product', {
      product: product,
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: editMode,
    });
  });
};

exports.postEditProduct = (request, response) => {
  const productId = get(request, 'query.productId');
  const title = request.body.title;
  const imageUrl = request.body.imageUrl;
  const price = request.body.price;
  const description = request.body.description;

  const product = new Product(title, price, description, imageUrl, productId);
  product.save(true).then(() => {
    response.redirect('/admin/products')
  });
};

exports.postAddProduct = (request, response) => {
  const title = request.body.title;
  const imageUrl = request.body.imageUrl;
  const price = request.body.price;
  const description = request.body.description;

  const product = new Product(title, price, description, imageUrl, null, request.user._id);
  product.save().then(() => {
    response.redirect('/admin/products')
  });
};

exports.deleteProduct = (request, response) => {
  const { productId } = request.params;
  Product.deleteById(productId).then(() => {
    response.redirect('/admin/products');
  });
};

exports.getProducts = (request, response) => {
  Product.fetchAll().then((result) => {
    response.render('admin/products', {
      prods: result,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  })
  // next();
};
