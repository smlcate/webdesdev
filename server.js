require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('./db/knex');
var bodyParser = require('body-parser');

// Models
var User = require('./models/User');

// Controllers
var userController = require('./controllers/users');


app.use(express.static('public'));
app.use(bodyParser.json());


app.post('/signup',
  userController.signUp);

app.post('/login',
  userController.logIn);

// app.get('/user',
//   userController.thisUser);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
