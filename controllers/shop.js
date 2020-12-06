const Product = require('../models/product');
const Cart = require('../models/cart');
const get = require('lodash/get');

exports.getProducts = (request, response) => {
  Product.findAll().then((result) => {
    response.render('shop/product-list', {
      prods: result,
      pageTitle: 'Shop',
      path: '/products',
      // layout: false - will not use a default layout
    });
    // hasProducts only for .handlebars templates, since the do not support such logic inside
  });
};

exports.getIndex = (request, response) => {
  Product.findAll().then(result => {
    response.render('shop/index', {
      prods: result,
      pageTitle: 'Shop',
      path: '/',
    });
    console.log('products got fetched');
  });
  // hasProducts only for .handlebars templates, since the do not support such logic inside
  // next();
};

exports.postCart = (request, response) => {
  // const prodId = request.body.productId;
  // Product.findByPk(prodId).then((result) => {
  //   const product = result;
  //   Cart.addProduct(prodId, Number(product.price), product.title, product.imageUrl);
  //   response.redirect('/cart')
  // }).catch(error => console.log(error));
  const prodId = get(request, 'body.productId');
  request.user.getCart()
    .then(async cart => {
      /** receive cart products */
      const products = await cart.getProducts({ where: { id: prodId } });
      /** find a selected product */
      /** a user already has this product in his cart */
      const foundProduct = await Product.findByPk(prodId);
      if (products.length > 0) {
        const oldQuantity = products[0].cartItem.quantity;
        const updatedQuantity = oldQuantity + 1;
        await cart.addProduct(foundProduct, {
          through: { quantity: updatedQuantity },
        })
      } else {
        await cart.addProduct(foundProduct, {
          through: { quantity: 1 }
        })
      }
      response.redirect('/cart');
    })
    .catch(error => console.log(error));
};

exports.getCart = (request, response) => {
  request.user.getCart()
    .then(cart => {
      return cart.getProducts()
        .then(products => {
          response.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            prods: products,
            totalPrice: 0,
          })
        });
    })
    .catch(error => console.log(error, 'error'));

  // Cart.fetchAll((cart) => {
  //   response.render('shop/cart', {
  //     path: '/cart',
  //     pageTitle: 'Your Cart',
  //     prods: cart.products,
  //     totalPrice: cart.totalPrice,
  //   })
  // })

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
  /** products/:productId */
  const prodId = get(request, 'params.productId');

  /** first method */
  // Product.findAll({ where: { id: prodId } });

  /** second method */
  Product.findByPk(prodId)
    .then((result) => {
      response.render('shop/product-details', {
        product: result,
        path: '/products',
        pageTitle: result.title
      })
    })
    .catch(error => console.log(error))
};
