const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://oleksii_user:UKOMaCGAgzt3fj0F@nod-express-learn-clust.ukrpb.mongodb.net/node-express-learn?retryWrites=true&w=majority', { useUnifiedTopology: true })
    .then(client => {
      _db = client.db();
      callback(client);
    })
    .catch(error => console.log(error, 'error'));
};

const getDB = () => {
  if (_db) return _db;
  throw 'no db connected';
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
