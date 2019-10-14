import {
  isValueCorrectType,
  doesObjectHaveRequiredProperties,
  createList,
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
    doesObjHaveRequiredProps,
    missingProps,
  } = doesObjectHaveRequiredProperties(req.body, requiredExamParams);
  if (doesObjHaveRequiredProps) {
    next();
  } else {
    res.status(400);
    res.json({
      error: `${createList(missingProps)} ${
        missingProps.length === 1 ? 'is' : 'are'
      } required`,
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

export {
  checkIfExamIdIsValid,
  doesCreateExamRequestHaveRequiredParams,
  areCreateExamRequestParamsCorrectTypes,
};
