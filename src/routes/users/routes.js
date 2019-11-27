import express from 'express';
import {
  signUpUser,
  getUser,
  deleteUser,
  logoutUser,
  loginUser,
  getUserExams,
} from './controller';
import {
  isUserAlreadyLoggedIn,
  doesSignupRequestHaveRequiredParams,
  areSignupRequestParamsCorrectType,
  areSignupRequestParamsEmpty,
  areLoginRequestParamsEmpty,
  doesEmailAlreadyExist,
  isUsernameValid,
  isEmailValid,
  isPasswordValid,
  doesLoginRequestHaveRequiredParams,
  isEmailInDatabase,
  doesPasswordMatchAccount,
} from './middleware';
import { isUserLoggedIn } from '../../common/middleware';

const userRoutes = express.Router();

userRoutes
  .route('/')
  .get(isUserLoggedIn, getUser)
  .delete(isUserLoggedIn, deleteUser);

userRoutes
  .route('/signup')
  .post(
    isUserAlreadyLoggedIn,
    doesSignupRequestHaveRequiredParams,
    areSignupRequestParamsCorrectType,
    areSignupRequestParamsEmpty,
    doesEmailAlreadyExist,
    isUsernameValid,
    isEmailValid,
    isPasswordValid,
    signUpUser,
  );

userRoutes
  .route('/login')
  .post(
    isUserAlreadyLoggedIn,
    doesLoginRequestHaveRequiredParams,
    areLoginRequestParamsEmpty,
    isEmailInDatabase,
    doesPasswordMatchAccount,
    loginUser,
  );

userRoutes.route('/logout').post(isUserLoggedIn, logoutUser);

userRoutes.route('/exams').get(isUserLoggedIn, getUserExams);

export default userRoutes;
