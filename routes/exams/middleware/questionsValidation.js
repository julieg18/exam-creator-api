import {
  isValueCorrectType,
  createList,
  doesRequestHaveRequiredParams,
} from '../../../common/helper';

import {
  doesQuestionHaveRequiredParams,
  areQuestionParamsCorrectTypes,
  doesQuestionHaveCorrectParamsForType,
} from '../helper';

function doesQuestionsArrayHaveObjElements(req, res, next) {
  const { questions } = req.body;
  const doesQuestionsArrHaveObjElements = questions.every((question) => {
    return isValueCorrectType(question, 'object');
  });
  if (doesQuestionsArrHaveObjElements) {
    next();
  } else {
    res.status(400);
    res.json({ error: 'questions must be an array of objects' });
  }
}

function doesQuestionsArrayElementsHaveRequiredParams(req, res, next) {
  const { questions } = req.body;
  const doesQuestionsArrHaveRequiredParams = questions.every((question) => {
    return doesQuestionHaveRequiredParams(question);
  });
  if (doesQuestionsArrHaveRequiredParams) {
    next();
  } else {
    res.status(400);
    res.json({
      error:
        'each question element must have a name, type, options, and answer property',
    });
  }
}

function areQuestionsArrayElementsParamsCorrectTypes(req, res, next) {
  const { questions } = req.body;
  const incorrectTypeParamErrs = [];
  questions.forEach((question) => {
    const {
      areQuestionParamsTheCorrectTypes,
      incorrectTypeParamErrsArr,
    } = areQuestionParamsCorrectTypes(question);
    if (!areQuestionParamsTheCorrectTypes) {
      incorrectTypeParamErrs.push(...incorrectTypeParamErrsArr);
    }
  });
  if (incorrectTypeParamErrs.length === 0) {
    next();
  } else {
    const uniqueErrsSet = new Set(incorrectTypeParamErrs);
    res.status(400);
    res.json({
      error: `questions' param values must be correct types: ${createList([
        ...uniqueErrsSet,
      ])}`,
    });
  }
}

function doesQuestionsArrayElementsHaveCorrectParamsForType(req, res, next) {
  const { questions } = req.body;
  const errorMessages = [];
  const typeTrueOrFalseErrors = [];
  const typeRadioOrCheckBoxErrors = [];
  questions.forEach((question) => {
    const {
      doTrueOrFalseErrorsExist,
      doRadioOrCheckBoxErrorsExist,
      typeTrueOrFalseErrorsArr,
      typeRadioOrCheckBoxErrorsArr,
    } = doesQuestionHaveCorrectParamsForType(question);
    if (doTrueOrFalseErrorsExist) {
      typeTrueOrFalseErrors.push(...typeTrueOrFalseErrorsArr);
    }
    if (doRadioOrCheckBoxErrorsExist) {
      typeRadioOrCheckBoxErrors.push(...typeRadioOrCheckBoxErrorsArr);
    }
  });
  if (typeTrueOrFalseErrors.length !== 0) {
    const typeTrueOrFalseErrorsSet = new Set(typeTrueOrFalseErrors);
    errorMessages.push(
      `for true_false type, ${createList([...typeTrueOrFalseErrorsSet])}`,
    );
  }
  if (typeRadioOrCheckBoxErrors.length !== 0) {
    const typeRadioOrCheckBoxErrorsSet = new Set(typeRadioOrCheckBoxErrors);
    errorMessages.push(
      `for radio or checkbox type, ${createList([
        ...typeRadioOrCheckBoxErrorsSet,
      ])}`,
    );
  }
  if (errorMessages.length === 0) {
    next();
  } else {
    const uniqueErrsSet = new Set(errorMessages);
    res.status(400);
    res.json({
      error: `questions' params must have correct values for type: ${createList(
        [...uniqueErrsSet],
      )}`,
    });
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

function areAddQuestionRequestParamsCorrectTypes(req, res, next) {
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

export {
  doesQuestionsArrayHaveObjElements,
  doesQuestionsArrayElementsHaveRequiredParams,
  areQuestionsArrayElementsParamsCorrectTypes,
  doesQuestionsArrayElementsHaveCorrectParamsForType,
  doesAddQuestionRequestHaveRequiredParams,
  areAddQuestionRequestParamsCorrectTypes,
  doesAddQuestionRequestHaveCorrectParamsForType,
};
