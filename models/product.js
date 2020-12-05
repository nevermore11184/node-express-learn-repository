// const fs = require('fs');
// const path = require('path');
// const rootDir = require('../utils/path');
//
// const Cart = require('./cart');
// const localPath = path.join(rootDir, 'data', 'products.json');
//
// const getProductsFromFile = callback => {
//   fs.readFile(localPath, (error, response) => {
//     if (error) return callback([]);
//     return callback(JSON.parse(response));
//   });
// };
//
// module.exports = class Product {
//   constructor(receivedTitle, imageUrl, price, description) {
//     this.title = receivedTitle;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }
//   save() {
//     this.id = Math.random().toString();
//     getProductsFromFile(products => {
//       const updatedProducts = [this, ...products];
//       fs.writeFile(localPath, JSON.stringify(updatedProducts), (error) => {
//         console.log(error);
//       })
//     })
//   }
//
//   update(id) {
//     this.id = Math.random().toString();
//     getProductsFromFile(products => {
//       const findProductIndex = products.findIndex(product => product.id === id);
//       products[findProductIndex] = this;
//       fs.writeFile(localPath, JSON.stringify(products), (error) => {
//         console.log(error);
//       })
//     })
//   }
//
//   static delete(id) {
//     getProductsFromFile(products => {
//       const updatedProducts = products.filter(product => product.id !== id);
//       const findProduct = products.find(product => product.id === id);
//       Cart.deleteProduct(id, findProduct.price);
//       fs.writeFile(localPath, JSON.stringify(updatedProducts), (error) => {
//         console.log(error);
//       })
//     })
//   }
//
//   // static means that you can call the method directly on
//   // the class itself and not on an instantiated object
//   // Product.fetchAll();
//
//   static fetchAll(callback) {
//     getProductsFromFile(callback);
//   }
//
//   static findById(id, callback) {
//     getProductsFromFile(products => {
//       const product = products.find(item => item.id === id);
//       callback(product);
//     })
//   }
// };
/*** local file system ^ */

/** pure mysql */
// const db = require('../utils/database');
// const rootDir = require('../utils/path');
//
// const Cart = require('./cart');
//
// module.exports = class Product {
//   constructor(receivedTitle, imageUrl, price, description) {
//     this.title = receivedTitle;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }
//   async save() {
//     return await db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)', [
//       this.title, this.price, this.imageUrl, this.description
//     ]);
//   }
//
//   update(id) {
//   }
//
//   static delete(id) {
//   }
//
//   // static means that you can call the method directly on
//   // the class itself and not on an instantiated object
//   // Product.fetchAll();
//
//   static async fetchAll () {
//     return await db.execute('SELECT * FROM products');
//   }
//
//   static async findById(id) {
//    return await db.execute('SELECT * FROM products WHERE products.id = ?', [id])
//   }
// };

/** sequelize */
const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

module.exports = Product;
