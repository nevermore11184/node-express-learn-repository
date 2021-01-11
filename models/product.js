const getDB = require('../utils/database').getDB;
const mongodb = require('mongodb');

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
    this.user =  { _id: userId };
  }

  async save(isEdit) {
    const db = getDB();
    if (isEdit) {
      const data = {
        title: this.title,
        price: this.price,
        description: this.description,
        imageUrl: this.imageUrl,
      };
      await db.collection('products').updateOne({ _id: new mongodb.ObjectId(this._id) }, {
        $set: {
          ...data,
          _id: new mongodb.ObjectId(this._id),
        }
      });
    } else {
      await db.collection('products').insertOne({ ...this });
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
