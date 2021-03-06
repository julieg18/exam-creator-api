import bcrypt from 'bcryptjs';
import { doesEmailExist } from './helper';
import {
  isValueCorrectType,
  createList,
  doesRequestHaveRequiredParams,
  areRequestParamsEmpty,
  createSentence,
} from '../../common/helper';
import User from '../../models/User';

function isUserAlreadyLoggedIn(req, res, next) {
  const {
    session: { user },
  } = req;
  if (!user) {
    next();
  } else {
    res.status(400);
    res.json({ error: 'A user is already logged in.' });
  }
}

function doesSignupRequestHaveRequiredParams(req, res, next) {
  const requiredParams = ['email', 'username', 'password'];
  const {
    doesReqHaveRequiredParams,
    errorMessage,
  } = doesRequestHaveRequiredParams(requiredParams, req.body);
  if (doesReqHaveRequiredParams) {
    next();
  } else {
    res.status(400);
    res.json({
      error: createSentence(errorMessage),
    });
  }
}

function areSignupRequestParamsCorrectType(req, res, next) {
  const params = ['username', 'email', 'password'];
  const errors = [];
  params.forEach((param) => {
    const paramValue = req.body[param];
    if (!isValueCorrectType(paramValue, 'string')) {
      errors.push(`${param} must be a string`);
    }
  });
  if (errors.length === 0) {
    next();
  } else {
    res.status(400);
    res.json({ error: createSentence(createList(errors)) });
  }
}

function areSignupRequestParamsEmpty(req, res, next) {
  const params = ['username', 'email', 'password'];
  const { areReqParamsEmpty, errorMessage } = areRequestParamsEmpty(
    params,
    req.body,
  );
  if (!areReqParamsEmpty) {
    next();
  } else {
    res.status(400);
    res.json({ error: createSentence(errorMessage) });
  }
}

function areLoginRequestParamsEmpty(req, res, next) {
  const params = ['email', 'password'];
  const { areReqParamsEmpty, errorMessage } = areRequestParamsEmpty(
    params,
    req.body,
  );
  if (!areReqParamsEmpty) {
    next();
  } else {
    res.status(400);
    res.json({ error: createSentence(errorMessage) });
  }
}

async function doesEmailAlreadyExist(req, res, next) {
  const { email } = req.body;
  const doesEmailExistInDB = await doesEmailExist(email);
  if (!doesEmailExistInDB) {
    next();
  } else {
    res.status(400);
    res.json({ error: 'Email already exists.' });
  }
}

function isUsernameValid(req, res, next) {
  const { username } = req.body;
  const errors = [];
  if (!/\S/g.test(username)) {
    errors.push('must not contain only whitespace');
  }
  if (username.length > 15) {
    errors.push('must not exceed 15 characters');
  }

  if (errors.length === 0) {
    next();
  } else {
    res.status(400);
    res.json({ error: `Username ${createList(errors)}.` });
  }
}

function isEmailValid(req, res, next) {
  const { email } = req.body;
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (emailRegex.test(email)) {
    next();
  } else {
    res.status(400);
    res.json({ error: 'Email is invalid.' });
  }
}

function isPasswordValid(req, res, next) {
  const { password } = req.body;
  const errors = [];

  if (/\s/g.test(password)) {
    errors.push('must not contain any whitespace');
  }
  if (password.length < 8) {
    errors.push('length must be at least 8 characters');
  }
  if (password.length > 50) {
    errors.push('length must not exceed 50 characters');
  }

  if (errors.length === 0) {
    next();
  } else {
    res.status(400);
    res.json({ error: `Password ${createList(errors)}.` });
  }
}

function doesLoginRequestHaveRequiredParams(req, res, next) {
  const requiredParams = ['email', 'password'];
  const {
    doesReqHaveRequiredParams,
    errorMessage,
  } = doesRequestHaveRequiredParams(requiredParams, req.body);
  if (doesReqHaveRequiredParams) {
    next();
  } else {
    res.status(400);
    res.json({
      error: createSentence(errorMessage),
    });
  }
}

async function isEmailInDatabase(req, res, next) {
  const { email } = req.body;
  const doesEmailExistInDB = await doesEmailExist(email);
  if (doesEmailExistInDB) {
    next();
  } else {
    res.status(400);
    res.json({ error: 'Email is incorrect.' });
  }
}

async function doesPasswordMatchAccount(req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const doPasswordsMatch = await bcrypt.compare(password, user.password);
  if (doPasswordsMatch) {
    next();
  } else {
    res.status(400);
    res.json({ error: 'Password is incorrect.' });
  }
}

export {
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
};
