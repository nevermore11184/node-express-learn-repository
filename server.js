// MVC pattern

// routes - representing your data, working with your data, save fetch and so on

// views are responsible for what a user sees, for rendering a relevant content, html documents and sending it back to a user

// connection point between routes and views, contains the "in-between" logic

{/** response.sendFile(path.join(rootDir, 'views', 'shop.html')); */} // send default html file

{/** __dirname */}
// is a global variable that holds an absolute path
// on our operating system, to the current project`s folder
const http = require('http');
const path = require('path');

// const db = require('./utils/database');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const Order = require('./models/order');
const CartItem = require('./models/cart-item');
const OrderItem = require('./models/order-item');

const express = require('express');

const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// db.execute('SELECT * FROM products').then((response) => {
//   console.log(response[0], 'response');
// }).catch((error) => {
//   console.log(error);
// });

const errorsController = require('./controllers/error');

const app = express(); // declaring an express application

/** mySQL relations */

// one to many
Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE', // removing a user will lead to removing all his products,
});
User.hasMany(Product);

// one to one
User.hasOne(Cart);
Cart.belongsTo(User);

// many to many
/** 1 cart can have multiple products */
Cart.belongsToMany(Product, { through: CartItem });

/** a single product can be part of multiple different carts */
Product.belongsToMany(Cart, { through: CartItem });

// many to many
/** 1 order can have multiple different products */
Order.belongsToMany(Product, { through: OrderItem });
/** a single product can be a part of multiple different orders */
Product.belongsToMany(Order, { through: OrderItem });

// one to many. A user can have multiple orders. However, an order can only be created by a single user.
User.hasMany(Order);
Order.belongsTo(User);

// app.engine('hbs', expressHbs({
//   extname: "hbs",
//   defaultLayout: "main-layout.hbs",
//   layoutsDir: "views/layouts/",
// }));

// app.set('view engine', 'pug');

// app.set('view engine', 'hbs');

app.set('view engine', 'ejs');
// allows us to set any values globally to the app
// usage by default, we can not set an extension like .html and so on

app.set('views', 'views');
// main project folder by default - ./views, where our views have to be found

app.use(bodyParser.urlencoded({ extended: false }));
// do all the request body parsing procedures
// instead of working with chunks and buffer

app.use((request, response, next) => {
  next(); {/** this always runs, intermediary middleware */}
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use((request, response, next) => {
  User.findByPk(1)
    .then(user => {
      request.user = user;
      next();
    })
    .catch(error => console.log(error));
});

app.use(express.static(path.join(__dirname, 'public')));

{/**
 files that are directly forwarded to the file system
 folder that we want to give a grand read access to
 */}

app.use('/admin', adminRoutes); {/** order matters */}

{/**
 '/admin' allows us to put a common starting segment for every route
 inside the router above, so we do not have to repeat it for all the
 routes inside
 */}

app.use(shopRoutes);

app.use('/catalogue', (request, response, next) => {
  console.log('catalogue');
  response.send('<h1>Catalogue page</h1>');
}); // will be executed only for /catalogue route

const { getErrorPage } = errorsController;

app.use('/', getErrorPage);

{/** default 404 error for all the unhandled routes **/}

// express does not send a default response

const server = http.createServer(app);

{/** automatically creates (syncs) all the defined models. (not override existing ones!) */}

// .sync({ force: true }) - overrides existing entities
sequelize.sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Oleksii', email: 'test.email@gmail.com' })
    } else {
      return user;
    }
  })
  .then((user) => {
    user.getCart().then(async cart => {
      if (!cart) {
        await user.createCart();
        const response = await user.getCart();
        response.totalPrice = 0;
        response.save();
      }
      return user;
    })
  })
  .then(user => {
    console.log(user, 'user');
    server.listen(8001); // or app.listen(8001)
  })
  .catch((error) => console.log(error));


{/** express is all about middlewares */}

{/** request => middleware => middleware => response - CORE CONCEPT */}
