const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helpers = require('./src/lib/haderbars');
const passport = require('passport');
const flash = require('connect-flash');
const { database } = require('./keys');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const multer = require('multer');

require('dotenv').config();




// console.log(process.env.GOOGLE_CLIENT_ID);
// console.log(process.env.GOOGLE_CLIENT_SECRET);
// console.log(process.env.GOOGLE_REDIRECT_URL);


require('./src/lib/passport');

app.use(session({
  secret: 'chillycodemynodemysql',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



//Rutas
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`servidor en puerto`, app.get('port'));
});


//Files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));

app.use(express.static('public', { type: 'text/css' }));
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, '/src/views')));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', 0);
  next();
});



app.use('/', require('./src/routes/index'));
app.use('/', require('./src/routes/authentication'));
app.use('/', require('./src/routes/profile'));
app.use(require('./src/routes/profile'));
helpers: require('./src/lib/haderbars');



//middleware
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended: false}));




app.use((req, res, next) => {
  res.status(404).render('404', {
      title: '404 Error',
      message: 'La página que estás buscando no existe.'
  });
});

app.use((err, req, res, next) => {
  res.status(500).render('404', {
      title: '500 Error',
      message: 'Ocurrió un error en el servidor.'
  });
});
