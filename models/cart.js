// const fs = require('fs');
// const path = require('path');
// const rootDir = require('../utils/path');
//
// const localPath = path.join(rootDir, 'data', 'cart.json');
//
// const getProductsFromCart = callback => {
//   fs.readFile(localPath, (error, response) => {
//     if (error) return callback([]);
//     return callback(JSON.parse(response));
//   });
// };
//
// module.exports = class Cart {
//   static addProduct(id, productPrice, title, imageUrl) {
//     fs.readFile(localPath, (error, fileContent) => {
//       if (error) {
//         const cart = { products: [], totalPrice: 0 };
//         fs.writeFile(localPath, JSON.stringify(cart), (error) => {
//           console.log(error, 'error');
//         });
//         return;
//       }
//       const cart = JSON.parse(fileContent);
//       const existingProductIndex = cart.products.findIndex(product => product.id === id);
//       const existingProduct = cart.products[existingProductIndex];
//       if (existingProduct) {
//         const updatedProduct = { ...existingProduct };
//         updatedProduct.quantity = updatedProduct.quantity + 1;
//         cart.products = [...cart.products];
//         cart.products[existingProductIndex] = updatedProduct;
//       } else {
//         const updatedProduct = { id, quantity: 1, title, imageUrl  };
//         cart.products = [...cart.products, updatedProduct];
//       }
//       cart.totalPrice = cart.totalPrice + productPrice;
//       fs.writeFile(localPath, JSON.stringify(cart), (error) => {
//         console.log(error, 'error');
//       })
//     })
//   }
//
//   static deleteProduct(id, productPrice) {
//     fs.readFile(localPath, (error, fileContent) => {
//       if (error) return;
//       const cart = JSON.parse(fileContent);
//       const updatedCart = { ...cart };
//       const product = updatedCart.products.find(prod => prod.id === id);
//       /** there is no such product in the cart */
//       if (!product) return;
//       const quantity = product.quantity;
//       cart.totalPrice = cart.totalPrice - productPrice * quantity;
//       cart.products = cart.products.filter(prod => prod.id !== id);
//       fs.writeFile(localPath, JSON.stringify(cart), (error) => {
//         console.log(error, 'error');
//       })
//     });
//   }
//
//   static fetchAll(callback){
//     getProductsFromCart(callback);
//   }
// };

const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Cart;
