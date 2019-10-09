import {
  isValueCorrectType,
  doesObjectHaveRequiredProperties,
} from '../../common/helper';

function doesCreateExamRequestHaveRequiredParams(req, res, next) {
  const requiredExamParams = ['creator', 'title', 'numberOfQuestions'];
  if (doesObjectHaveRequiredProperties(req.body, requiredExamParams)) {
    next();
  } else {
    res.json({ error: 'creator, title, and numberOfQuestions are required' });
  }
}

function areCreateExamRequestParamsCorrectTypes(req, res, next) {
  const params = Object.keys(req.body);
  const incorrectTypeParamErrs = [];
  params.forEach((param) => {
    switch (param) {
      case 'creator':
        break;
      case 'title':
        break;
      case 'numberOfQuestions':
        break;
      case 'questions':
        break;
      case 'students':
        break;
      default:
        return param;
    }
  });
  if (incorrectTypeParamErrs.length !== 0) {
    res.json({ error: incorrectTypeParamErrs.join(' ') });
  } else {
    next();
  }
}

function doesQuestionsArrayHaveRequiredParams(req, res, next) {}

function doesStudentsArrayHaveRequiredParms(req, res, next) {}

export {
  doesCreateExamRequestHaveRequiredParams,
  doesQuestionsArrayHaveRequiredParams,
  doesStudentsArrayHaveRequiredParms,
};
