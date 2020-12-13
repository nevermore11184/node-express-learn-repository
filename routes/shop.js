const shopController = require('../controllers/shop');

const express = require('express');

const router = express.Router();

const {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getSpecificProduct,
  postCart,
  postCardDeleteProduct,
  postOrder,
} = shopController;

// GET, POST and other methods will do an exact match here!!!
router.get('/', getIndex);

router.get('/products', getProducts);

router.get(`/products/:productId`, getSpecificProduct);

router.get('/cart', getCart);

router.post('/cart-delete-product/:productId', postCardDeleteProduct);

router.post('/cart', postCart);

router.get('/orders', getOrders);

router.get('/checkout', getCheckout);

router.post('/create-order', postOrder);

module.exports = router;
