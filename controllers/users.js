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

  console.log(req.body.projects.data.projects)

  var hash = bcrypt.hashSync(req.body.email, bcrypt.genSaltSync(10));

  var user = {
    email: req.body.email,
    password: hash,
    pivotalAPI: req.body.pivotalAPI
  }


  knex('users')
  .insert(user)
  .then(function() {
    knex('users')
    .select('*')
    .where({'email': user.email})
    .then(function(data) {

      console.log(data[0])

      if(bcrypt.compareSync(req.body.email, data[0].password)){

        res.send({token:jwt.sign(data[0],process.env.SECRET),email:data[0].email, pivotalAPI:data[0].pivotalAPI});

      }

    })
  })

  .catch(function(err) {
    console.log(err);
  })

}

exports.logIn = function(req, res, next) {

  console.log(req.body.projects.data)

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

exports.newProject = function(req, res, next) {

  console.log(req.body);



  knex('projects')
  .insert(req.body)
  .then(function() {
    knex.select('*')
    .from('projects')
    .where({projectTitle:req.body.projectTitle})
    .then(function(data) {
      console.log(data);
      res.send({data:data})
    })
    .catch(function(err) {
      console.log(err);
    })
  })

}

exports.selectProject = function(req, res, next) {

  console.log(req.body)

  var project = req.body[0];



  knex.select('*')
  .from('files')
  .where({'projectId':project.id})
  .then(function(data) {
    project.files = data;
    console.log(project);
    res.send({data:project})
  })



  }

  // exports.getProject = function(req, res, next) {
  //
  //
  //
  // }

exports.makeFiles = function(req, res, next) {

  var files = [
    {
      projectId: req.body[0].id,
      type: 'html',
      name: 'index.html'
    },
    {
      projectId: req.body[0].id,
      type: 'css',
      name: 'main.css'
    }
  ]


  for (var i = 0; i < files.length; i++) {

    knex('files')
    .insert(files[i])
    .then(function() {
      return knex.select('*')
      .from('files')
      .where({'projectId':req.body[0].id})
      .then(function(data) {

      })
      res.send('connected')
    })

  }


}

// exports.thisUser = function(req, res, next) {
//
//   return req.body
//
// }
