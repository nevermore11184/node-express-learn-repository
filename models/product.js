const getDB = require('../utils/database').getDB;
const mongodb = require('mongodb');

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
  }

  async save(isEdit) {
    const db = getDB();
    if (isEdit) {
      await db.collection('products').updateOne({ _id: new mongodb.ObjectId(this._id) }, {
        $set: {
          ...this,
          _id: new mongodb.ObjectId(this._id)
        }
      });
    } else {
      await db.collection('products').insertOne(this);
    }
  }

  static fetchAll() {
    const db = getDB();
    return db.collection('products').find().toArray();
  }

  static async findById(id) {
    const db = getDB();
    return await db.collection('products').find(new mongodb.ObjectId(id)).next();
  }

  static deleteById(id) {
    const db = getDB();
    return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = Product;
