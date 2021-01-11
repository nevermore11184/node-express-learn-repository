const Product = require('../models/product');
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
  const productId = get(request, 'body.productId');
  Product.findById(productId).then(product => {
    return request.user.addToCart(product);
  })
    .then(() => response.redirect('/cart'))
};

exports.getCart = (request, response) => {
  request.user.getCart().then(object => {
    response.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Cart',
      prods: object.convertedProducts,
      totalPrice: object.totalPrice,
    })
  })
};

exports.postCardDeleteProduct = (request, response) => {
  const prodId = get(request, 'body.productId');
  request.user.deleteItemFromCart(prodId).then(() => {
    response.redirect('/cart');
  })
};

exports.postOrders = (request, response) => {
  request.user.addOrder().then(() => {
    response.redirect('/cart');
  });
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
