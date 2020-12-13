const Product = require('../models/product');
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
  request.user.getCart().then(async cart => {
      /** fetch ONLY 1 product in a cart that belongs to found IDENTIFIER */
      const products = await cart.getProducts({ where: { id: prodId } });
      /** find a product */
      const foundProduct = await Product.findByPk(prodId);
      const oldQuantity = get(products, '[0].cartItem.quantity');
      const updatedQuantity = oldQuantity + 1;
      /** product will be added in this in-between (cartItem) table */
      await cart.addProduct(foundProduct, {
        through: { quantity: products.length > 0 ? updatedQuantity : 1 },
      });
      response.redirect('/cart');

      const previousTotalPrice = cart.totalPrice;
      cart.totalPrice = previousTotalPrice + foundProduct.price;
      cart.save().then(() => {
        response.redirect('/cart');
      });
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
            totalPrice: cart.totalPrice,
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
  request.user.getCart().then(async cart => {
    const products = await cart.getProducts({ where: { id: productId } });
    const product = products[0];
    await product.cartItem.destroy();
    response.redirect('/');
  });

  /** implementation without mySQL */
  // Product.fetchAll((products) => {
  //   const removedProduct = products.find(product => product.id === productId);
  //   Cart.deleteProduct(productId, removedProduct.price)
  // });
  // response.redirect('/cart');
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

exports.postOrder = (request, response) => {

};
