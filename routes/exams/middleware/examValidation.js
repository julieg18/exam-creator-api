import {
  isValueCorrectType,
  createList,
  doesRequestHaveRequiredParams,
} from '../../../common/helper';
import { isExamIdValid } from '../helper';

async function checkIfExamIdIsValid(req, res, next) {
  const { examId } = req.params;
  const isIdValid = await isExamIdValid(examId);
  if (isIdValid) {
    next();
  } else {
    res.status(400);
    res.json({ error: 'invalid examId' });
  }
}

function doesCreateExamRequestHaveRequiredParams(req, res, next) {
  const requiredExamParams = ['creator', 'title'];
  const {
    doesReqHaveRequiredParams,
    errorMessage,
  } = doesRequestHaveRequiredParams(requiredExamParams, req.body);
  if (doesReqHaveRequiredParams) {
    next();
  } else {
    res.status(400);
    res.json({
      error: errorMessage,
    });
  }
}

function doesEditExamRequestHaveRequiredParams(req, res, next) {
  const requiredExamParams = ['title'];
  const {
    doesReqHaveRequiredParams,
    errorMessage,
  } = doesRequestHaveRequiredParams(requiredExamParams, req.body);
  if (doesReqHaveRequiredParams) {
    next();
  } else {
    res.status(400);
    res.json({
      error: errorMessage,
    });
  }
}

function areCreateExamRequestParamsCorrectTypes(req, res, next) {
  const params = Object.keys(req.body);
  const incorrectTypeParamErrs = [];
  params.forEach((param) => {
    const paramValue = req.body[param];
    switch (param) {
      case 'creator':
        if (!isValueCorrectType(paramValue, 'string')) {
          incorrectTypeParamErrs.push('creator must be a string');
        }
        break;
      case 'title':
        if (!isValueCorrectType(paramValue, 'string')) {
          incorrectTypeParamErrs.push('title must be a string');
        }
        break;
      case 'questions':
        if (!isValueCorrectType(paramValue, 'array')) {
          incorrectTypeParamErrs.push('questions must be a array');
        }
        break;
      case 'students':
        if (!isValueCorrectType(paramValue, 'array')) {
          incorrectTypeParamErrs.push('students must be a array');
        }
        break;
      default:
        return param;
    }
  });
  if (incorrectTypeParamErrs.length === 0) {
    next();
  } else {
    res.status(400);
    res.json({ error: createList(incorrectTypeParamErrs) });
  }
}

function isEditExamRequestParamCorrectType(req, res, next) {
  const { title } = req.body;
  if (isValueCorrectType(title, 'string')) {
    next();
  } else {
    res.status(400);
    res.json({ error: 'title must be a string' });
  }
}

export {
  checkIfExamIdIsValid,
  doesCreateExamRequestHaveRequiredParams,
  doesEditExamRequestHaveRequiredParams,
  areCreateExamRequestParamsCorrectTypes,
  isEditExamRequestParamCorrectType,
};
