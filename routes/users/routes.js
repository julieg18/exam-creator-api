const express = require('express');

const userRoutes = express.Router();

userRoutes
  .route('/:userId')
  .get((req, res, next) => {
    res.send('this route should be used to get information about a user');
  })
  .delete((req, res, next) => {
    res.send('this route should be used to delete a user');
  });

userRoutes.route('/login').post((req, res, next) => {
  res.send('this route should be used to login a user');
});

userRoutes.route('/signup').post((req, res, next) => {
  res.send('this route should be used to signup a user');
});

module.exports = userRoutes;
