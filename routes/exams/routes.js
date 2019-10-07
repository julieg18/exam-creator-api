const express = require('express');

const { addExamToDatabase } = require('./controller');

const examRoutes = express.Router();

examRoutes.route('/').post(addExamToDatabase);

examRoutes
  .route('/:examId')
  .get((req, res) => {
    res.send('this route should get a specific exam');
  })
  .put((req, res) => {
    res.send('this route should edit a specific exam');
  })
  .delete((req, res) => {
    res.send('this route should delete a specific exam');
  });

examRoutes.route('/user/:userId').get((req, res) => {
  res.send("this route should get a user's exam");
});

module.exports = examRoutes;
