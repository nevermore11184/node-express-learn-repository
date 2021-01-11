const getDB = require('../utils/database').getDB;
const mongodb = require('mongodb');

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  async save() {
    const db = getDB();
    return await db.collection('users').insertOne(this);
  }

  static async findById(userId) {
    const db = getDB();
    return await db.collection('users').find(new mongodb.ObjectId(userId)).next();
  }

  async addToCart(product) {
    const db = getDB();

    if (!this.cart) this.cart = { totalPrice: 0, items: [] };
    const doesProductExistIndex = this.cart.items.findIndex(item => item.product_id.toString() === product._id.toString());

    const copiedCartItems = [...this.cart.items];
    if (doesProductExistIndex !== -1) {
      copiedCartItems[doesProductExistIndex] = {
        product_id: new mongodb.ObjectId(product._id),
        quantity: copiedCartItems[doesProductExistIndex].quantity + 1,
        price: product.price,
      };
    } else {
      copiedCartItems.push({
        product_id: new mongodb.ObjectId(product._id),
        quantity: 1,
        price: product.price,
      })
    }

    return db.collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { totalPrice: this.cart.totalPrice + Number(product.price), items: copiedCartItems } } }
      )
  }

  async getCart() {
    const db = getDB();
    if (!this.cart) this.cart = { totalPrice: 0, items: [] };
    const productIds = this.cart.items.map(item => item.product_id);
    const cartProducts = await db.collection('products').find({
      _id: { $in: productIds }
    }).toArray();
    const convertedProducts = cartProducts.map(product => ({
      ...product,
      quantity: this.cart.items.find(cartItem => cartItem.product_id.toString() === product._id.toString()).quantity
    }));
    return {
      convertedProducts,
      totalPrice: this.cart.totalPrice,
    }
  }

  async deleteItemFromCart(productId) {
    const db = getDB();
    const updatedCartItems = this.cart.items.filter(item => {
      return item.product_id.toString() !== productId.toString();
    });
    const productToRemove = this.cart.items.find(product => product.product_id.toString() === productId);
    return db.collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { totalPrice: this.cart.totalPrice - (productToRemove.quantity * productToRemove.price) , items: updatedCartItems } } }
      );
  }

  async addOrder() {
    const db = getDB();
    await db.collection('orders').insertOne(this.cart);
    const refreshedCart = { totalPrice: 0, items: [] };
    this.cart = refreshedCart;
    await db.collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: refreshedCart } })
  }
}

module.exports = User;
