const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

const {
  getAddProductPage,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = adminController;

router.get('/add-product', getAddProductPage);

router.post('/add-product', postAddProduct);

router.get('/products', getProducts);

router.get('/edit-product/:productId', getEditProduct);

router.post('/edit-product', postEditProduct);

router.post('/delete-product/:productId', deleteProduct);

// module.exports = router; - another syntax of exporting

module.exports = router;
