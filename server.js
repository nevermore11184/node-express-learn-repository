// MVC pattern

// routes - representing your data, working with your data, save fetch and so on

// views are responsible for what a user sees, for rendering a relevant content, html documents and sending it back to a user

// connection point between routes and views, contains the "in-between" logic

{/** response.sendFile(path.join(rootDir, 'views', 'shop.html')); */} // send default html file

{/** __dirname */}
const User = require('./models/user');
// is a global variable that holds an absolute path
// on our operating system, to the current project`s folder
const http = require('http');
const path = require('path');

const express = require('express');
const mongoConnect = require('./utils/database').mongoConnect;

const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorsController = require('./controllers/error');

const app = express(); // declaring an express application


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

app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
  User.findById('5ff9ad90bad08c8aa7af2d2c')
    .then(user => {
      request.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(error => console.log(error));
});

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
mongoConnect((client) => {
  server.listen(8001); // or app.listen(8001)
  console.log('client is connected!');
});

{/** express is all about middlewares */}

{/** request => middleware => middleware => response - CORE CONCEPT */}
