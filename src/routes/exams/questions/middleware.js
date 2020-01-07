import {
  createList,
  doesRequestHaveRequiredParams,
} from '../../../common/helper';

import {
  isQuestionIdValid,
  getQuestionFromDatabase,
  areQuestionParamsCorrectTypes,
  getCheckboxQuestionPropertyValueErrors,
  getRadioQuestionPropertyValueErrors,
  getTrueOrFalseQuestionPropertyValueErrors,
} from '../helper';

async function checkIfQuestionIdIsValid(req, res, next) {
  const { examId } = req.params;
  const { questionId } = req.body;
  const isIdValid = await isQuestionIdValid(examId, questionId);
  if (isIdValid) {
    next();
  } else {
    res.status(400);
    res.json({ error: 'invalid questionId' });
  }
}

function doesAddQuestionRequestHaveRequiredParams(req, res, next) {
  const requiredQuestionParams = ['name', 'type', 'options', 'answer'];
  const {
    doesReqHaveRequiredParams,
    errorMessage,
  } = doesRequestHaveRequiredParams(requiredQuestionParams, req.body);
  if (doesReqHaveRequiredParams) {
    next();
  } else {
    res.status(400);
    res.json({
      error: errorMessage,
    });
  }
}

function doesEditQuestionRequestHaveRequiredParams(req, res, next) {
  const requiredQuestionParams = [
    ['questionId', 'name'],
    ['questionId', 'type'],
    ['questionId', 'options'],
    ['questionId', 'answer'],
  ];
  const doesEditQuestionReqHaveRequiredParams = requiredQuestionParams.some(
    (requiredParams) => {
      const { doesReqHaveRequiredParams } = doesRequestHaveRequiredParams(
        requiredParams,
        req.body,
      );
      return doesReqHaveRequiredParams;
    },
  );
  if (doesEditQuestionReqHaveRequiredParams) {
    next();
  } else {
    res.status(400);
    res.json({
      error:
        'questionId and at least one param(type, options, name, or answer) to be changed is required',
    });
  }
}

function areQuestionRequestParamsCorrectTypes(req, res, next) {
  const {
    areQuestionParamsTheCorrectTypes,
    incorrectTypeParamErrsArr,
  } = areQuestionParamsCorrectTypes(req.body);
  if (areQuestionParamsTheCorrectTypes) {
    next();
  } else {
    res.status(400);
    res.json({ error: createList(incorrectTypeParamErrsArr) });
  }
}

function doesAddQuestionRequestHaveCorrectParamsForType(req, res, next) {
  let errors = [];
  switch (req.body.type) {
    case 'checkbox':
      errors = [...getCheckboxQuestionPropertyValueErrors(req.body)];
      break;
    case 'radio':
      errors = [...getRadioQuestionPropertyValueErrors(req.body)];
      break;
    case 'true_false':
      errors = [...getTrueOrFalseQuestionPropertyValueErrors(req.body)];
      break;
    default:
  }
  if (errors.length === 0) {
    next();
  } else {
    const errorMessage = `for a question with a ${
      req.body.type
    } type: ${createList(errors)}`;
    res.status(400);
    res.json({ error: errorMessage });
  }
}

async function doesEditQuestionRequestHaveCorrectParamsForType(req, res, next) {
  const { examId } = req.params;
  const { questionId } = req.body;
  const questionParams = ['name', 'type', 'options', 'answer'];
  let questionToBeEdited = await getQuestionFromDatabase(examId, questionId);
  questionToBeEdited = questionToBeEdited.toObject();
  const questionObject = {};
  questionParams.forEach((param) => {
    questionObject[param] = req.body[param]
      ? req.body[param]
      : questionToBeEdited[param];
    return param;
  });

  let errors = [];
  switch (questionObject.type) {
    case 'checkbox':
      errors = [...getCheckboxQuestionPropertyValueErrors(questionObject)];
      break;
    case 'radio':
      errors = [...getRadioQuestionPropertyValueErrors(questionObject)];
      break;
    case 'true_false':
      errors = [...getTrueOrFalseQuestionPropertyValueErrors(questionObject)];
      break;
    default:
  }
  if (errors.length === 0) {
    next();
  } else {
    const errorMessage = `for a question with a ${
      questionObject.type
    } type: ${createList(errors)}`;
    res.status(400);
    res.json({ error: errorMessage });
  }
}

export {
  checkIfQuestionIdIsValid,
  doesAddQuestionRequestHaveRequiredParams,
  doesEditQuestionRequestHaveRequiredParams,
  areQuestionRequestParamsCorrectTypes,
  doesAddQuestionRequestHaveCorrectParamsForType,
  doesEditQuestionRequestHaveCorrectParamsForType,
};
