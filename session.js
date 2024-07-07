const session = require('express-session');
const flash = require('connect-flash');
const MYSQLStore = require('express-mysql-session')(session);
const { database } = require('./keys');

const options = {
  secret: 'fazt mysql session',
  resave: false,
  saveUninitialized:false,
  store: new MYSQLStore(database)
};

module.exports = {
  session: session(options),
  flash: flash()
};
global.user = null;

