import express from 'express';
import {
  signUpUser,
  getUser,
  deleteUser,
  logoutUser,
  loginUser,
  getUserExams,
} from './controller';

const userRoutes = express.Router();

userRoutes.route('/').get(getUser);

userRoutes.route('/:userId').delete(deleteUser);

userRoutes.route('/signup').post(signUpUser);

userRoutes.route('/login').post(loginUser);

userRoutes.route('/logout').post(logoutUser);

userRoutes.route('/exams/:userId').get(getUserExams);

export default userRoutes;
