const Product = require('../models/product');
const Cart = require('../models/cart');
const get = require('lodash/get');

exports.getProducts = (request, response) => {
  Product.fetchAll().then(([rows]) => {
    response.render('shop/product-list', {
      prods: rows,
      pageTitle: 'Shop',
      path: '/products',
      // layout: false - will not use a default layout
    });
    // hasProducts only for .handlebars templates, since the do not support such logic inside
  });
};

exports.getIndex = (request, response) => {
  Product.fetchAll().then(([rows]) => {
    response.render('shop/index', {
      prods: rows,
      pageTitle: 'Shop',
      path: '/',
    });
  });
  // hasProducts only for .handlebars templates, since the do not support such logic inside
  // next();
};

exports.postCart = (request, response) => {
  const prodId = request.body.productId;
  Product.findById(prodId).then(([result]) => {
    const product = result[0];
    Cart.addProduct(prodId, Number(product.price), product.title, product.imageUrl);
    response.redirect('/cart')
  })
    .catch(error => console.log(error));
};

exports.getCart = (request, response) => {
  Cart.fetchAll((cart) => {
    response.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      prods: cart.products,
      totalPrice: cart.totalPrice,
    })
  })
};

exports.postCardDeleteProduct = (request, response) => {
  const { productId } = request.params;
  Product.fetchAll((products) => {
    const removedProduct = products.find(product => product.id === productId);
    Cart.deleteProduct(productId, removedProduct.price)
  });
  response.redirect('/cart');
};

exports.getOrders = (request, response, next) => {
  response.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Cart',
  })
};

exports.getCheckout = (request, response) => {
  response.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
};

exports.getSpecificProduct = (request, response) => {
  const prodId = get(request, 'params.productId');
  // products/:productId
  Product.findById(prodId)
    .then(([product]) => {
      response.render('shop/product-details', {
        product: product[0],
        path: '/products',
        pageTitle: product.title
      })
    })
    .catch(error => console.log(error))
};
