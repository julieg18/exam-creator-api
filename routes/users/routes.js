import express from 'express';

const userRoutes = express.Router();

userRoutes
  .route('/:userId')
  .get((req, res) => {
    res.send('this route should be used to get a user profile');
  })
  .delete((req, res) => {
    res.send('this route should be used to delete a user');
  });

userRoutes.route('/signup').post((req, res) => {
  res.send('this route should be used to signup a user');
});

userRoutes.route('/login').post((req, res) => {
  res.send('this route should be used to login a user');
});

userRoutes.route('/logout').post((req, res) => {
  res.send('this route should be used to logout a user');
});

export default userRoutes;
