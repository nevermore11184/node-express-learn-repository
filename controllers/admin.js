const Product = require('../models/product');

exports.getAddProductPage = (request, response) => {
  console.log('add-product');

  response.render('admin/add-product', {
    pageTitle: 'Add a product',
    path: '/admin/add-product',
  });
  // next()
};

exports.getEditProduct = (request, response) => {
  const editMode = request.query.edit;
  const prodId = request.params.productId;
  Product.findById(prodId, (product) => {
    response.render('admin/edit-product', {
      product,
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: editMode,
    });
  });
  // next()
};

exports.postEditProduct = (request, response) => {
  const title = request.body.title;
  const imageUrl = request.body.imageUrl;
  const price = request.body.price;
  const description = request.body.description;
  const product = new Product(title, imageUrl, price, description);
  const productId = request.query.productId;
  product.update(productId);
  response.redirect('/admin/products')
};

exports.postAddProduct = (request, response) => {
  const title = request.body.title;
  const imageUrl = request.body.imageUrl;
  const price = request.body.price;
  const description = request.body.description;
  const product = new Product(title, imageUrl, price, description);
  product.save()
    .then(() => {
      console.log(request.body, '<= response and redirect to products page');
      response.redirect('/');
    })
    .catch(error => console.log(error));
};

exports.deleteProduct = (request, response) => {
  const { productId } = request.params;
  Product.delete(productId);
  response.redirect('/admin/products');
};

exports.getProducts = (request, response) => {
  Product.fetchAll().then(([rows]) => {
    response.render('admin/products', {
      prods: rows,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  })
  // next();
};
