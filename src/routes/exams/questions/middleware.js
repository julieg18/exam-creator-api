import {
  createList,
  doesRequestHaveRequiredParams,
} from '../../../common/helper';

import {
  isQuestionIdValid,
  getQuestionFromDatabase,
  areQuestionParamsCorrectTypes,
  doesQuestionHaveCorrectParamsForType,
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
  const {
    doTrueOrFalseErrorsExist,
    doRadioOrCheckBoxErrorsExist,
    typeTrueOrFalseErrorsArr,
    typeRadioOrCheckBoxErrorsArr,
  } = doesQuestionHaveCorrectParamsForType(req.body);
  if (!doTrueOrFalseErrorsExist && !doRadioOrCheckBoxErrorsExist) {
    next();
  } else {
    const error = doTrueOrFalseErrorsExist
      ? `for a question with a true_false type, ${createList([
          ...typeTrueOrFalseErrorsArr,
        ])}`
      : `for a question with a radio or checkbox type, ${createList([
          ...typeRadioOrCheckBoxErrorsArr,
        ])}`;
    res.status(400);
    res.json({ error });
  }
}

async function doesEditQuestionRequestHaveCorrectParamsForType(req, res, next) {
  const { examId } = req.params;
  const { questionId } = req.body;
  const questionParams = ['name', 'type', 'options', 'answer'];
  const questionToBeEdited = await getQuestionFromDatabase(examId, questionId);
  const questionObject = {};
  questionParams.forEach((param) => {
    questionObject[param] = req.body[param]
      ? req.body[param]
      : questionToBeEdited[param];
    return param;
  });

  const {
    doTrueOrFalseErrorsExist,
    doRadioOrCheckBoxErrorsExist,
    typeTrueOrFalseErrorsArr,
    typeRadioOrCheckBoxErrorsArr,
  } = doesQuestionHaveCorrectParamsForType(questionObject);
  if (!doTrueOrFalseErrorsExist && !doRadioOrCheckBoxErrorsExist) {
    next();
  } else {
    const error = doTrueOrFalseErrorsExist
      ? `for a question with a true_false type, ${createList([
          ...typeTrueOrFalseErrorsArr,
        ])}`
      : `for a question with a radio or checkbox type, ${createList([
          ...typeRadioOrCheckBoxErrorsArr,
        ])}`;
    res.status(400);
    res.json({ error });
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
