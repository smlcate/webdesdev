require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');
var User = require('../models/User');

var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

var crypto = require('crypto');
var bcrypt = require('bcrypt');

app.use(bodyParser.json());
app.use(expressJWT({ secret: 'shhhh' }))

exports.signUp = function(req, res, next) {

  // console.log(req.body)

  var hash = bcrypt.hashSync(req.body.email, bcrypt.genSaltSync(10));

  var user = {
    email: req.body.email,
    password: hash,
    pivotalAPI: req.body.pivotalAPI
  }

  knex('users')
  .insert(user)
  .then(function() {
    console.log(user);
    res.json({token:jwt.sign(user,process.env.SECRET),user:user});
  })
  .catch(function(err) {
    console.log(err);
  })

}

exports.logIn = function(req, res, next) {

  // console.log(req.body)

  var hash = bcrypt.hashSync(req.body.email, bcrypt.genSaltSync(10));

  knex('users')
  .select('*')
  .where({'email': req.body.email})
  .then(function(data) {

    console.log(data[0])

    if(bcrypt.compareSync(req.body.email, data[0].password)){

      res.send({token:jwt.sign(data[0],process.env.SECRET),email:data[0].email, pivotalAPI:data[0].pivotalAPI});

    }

  })
  .catch(function(err) {
    console.log(err);
  })

}

// exports.thisUser = function(req, res, next) {
//
//   return req.body
//
// }
