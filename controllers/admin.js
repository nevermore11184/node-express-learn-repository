const get = require('lodash/get');
const Product = require('../models/product');

exports.getAddProductPage = (request, response) => {
  response.render('admin/add-product', {
    pageTitle: 'Add a product',
    path: '/admin/add-product',
  });
  // next()
};

exports.getEditProduct = (request, response) => {
  const editMode = get(request, 'query.edit');

  const prodId = get(request, 'params.productId');

  /** will find only one product */
  request.user.getProducts({ where: { id: prodId } }).then(results => {
    response.render('admin/edit-product', {
      product: results[0],
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: editMode,
    });
  });

  /** no relations implementation */
  // Product.findByPk(prodId).then(result => {
  //   response.render('admin/edit-product', {
  //     product: result,
  //     pageTitle: 'Edit product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //   });
  // })
  // next()
};

exports.postEditProduct = (request, response) => {
  const productId = get(request, 'query.productId');
  const title = request.body.title;
  const imageUrl = request.body.imageUrl;
  const price = request.body.price;
  const description = request.body.description;

  /** old implementation */
  // const product = new Product(title, imageUrl, price, description);
  // product.update(productId);

  Product.findByPk(productId)
    .then(result => {
      result.title = title;
      result.imageUrl = imageUrl;
      result.price = price;
      result.description = description;
      result.save().then(() => {
        response.redirect('/admin/products')
      });
    }).catch(error => console.log(error));
};

exports.postAddProduct = (request, response) => {
  const title = request.body.title;
  const imageUrl = request.body.imageUrl;
  const price = request.body.price;
  const description = request.body.description;

  /** pure mySQL implementation */
  // const product = new Product(title, imageUrl, price, description);
  // product.save()
  //   .then(() => {
  //     console.log(request.body, '<= response and redirect to products page');
  //     response.redirect('/');
  //   })
  //   .catch(error => console.log(error));

  /** sequilize */
  // Product.create({
  //   title,
  //   imageUrl,
  //   price,
  //   description,
  //   userId: request.user.id,
  // });
  request.user.createProduct({
    title,
    imageUrl,
    price,
    description,
  })
    .then(() => {
      console.log('product is created.');
      response.redirect('/');
    }).catch(error => console.log(error));
};

exports.deleteProduct = (request, response) => {
  const { productId } = request.params;
  request.user.getCart().then(async cart => {
    const products = await cart.getProducts({ where: { id: productId } });
    const product = products[0];
    if (product) {
      const quantity = product.cartItem.quantity;
      cart.totalPrice = cart.totalPrice - (quantity * product.price);
      cart.save().then(() => {
        Product.destroy({ where: { id: productId } });
        response.redirect('/admin/products');
      })
    } else {
      Product.destroy({ where: { id: productId } });
      response.redirect('/admin/products');
    }
  });
  /** or */
  // Product.findByPk(productId)
  //   .then(result => result.destroy())
  //   .catch(error => console.log(error));
};

exports.getProducts = (request, response) => {
  request.user.getProducts().then((result) => {
    response.render('admin/products', {
      prods: result,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  })
  // next();
};
