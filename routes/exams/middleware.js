import {
  isValueCorrectType,
  doesObjectHaveRequiredProperties,
  createList,
} from '../../common/helper';

function doesCreateExamRequestHaveRequiredParams(req, res, next) {
  const requiredExamParams = ['creator', 'title', 'numberOfQuestions'];
  const {
    doesObjHaveRequiredProps,
    missingProps,
  } = doesObjectHaveRequiredProperties(req.body, requiredExamParams);
  if (doesObjHaveRequiredProps) {
    next();
  } else {
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
      case 'numberOfQuestions':
        if (!isValueCorrectType(Number(paramValue), 'number')) {
          incorrectTypeParamErrs.push('numberOfQuestions must be a number');
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
  if (incorrectTypeParamErrs.length !== 0) {
    res.json({ error: createList(incorrectTypeParamErrs) });
  } else {
    next();
  }
}

function doesQuestionsArrayHaveRequiredParams(req, res, next) {}

function doesStudentsArrayHaveRequiredParms(req, res, next) {}

export {
  doesCreateExamRequestHaveRequiredParams,
  areCreateExamRequestParamsCorrectTypes,
  doesQuestionsArrayHaveRequiredParams,
  doesStudentsArrayHaveRequiredParms,
};
