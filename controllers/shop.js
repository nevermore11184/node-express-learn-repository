const Product = require('../models/product');
// const Cart = require('../models/cart');
const get = require('lodash/get');

exports.getProducts = (request, response) => {
  Product.fetchAll().then(products => {
    response.render('shop/product-list', {
      prods: products,
      pageTitle: 'All products',
      path: '/products'
    })
  });
};

exports.getIndex = (request, response) => {
  Product.fetchAll().then(products => {
    response.render('shop/index', {
      prods: products,
      pageTitle: 'All products',
      path: '/products'
    })
  });
};

exports.postCart = (request, response) => {
};

exports.getCart = (request, response) => {
};

exports.postCardDeleteProduct = (request, response) => {
};

exports.getOrders = (request, response, next) => {
};

exports.getCheckout = (request, response) => {
};

exports.getSpecificProduct = (request, response) => {
  const prodId = get(request, 'params.productId');
  Product.findById(prodId).then(product => {
    response.render('shop/product-details', {
      product,
      pageTitle: product.title,
      path: '/products',
    })
  })
};
