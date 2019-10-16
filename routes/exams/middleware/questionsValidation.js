import {
  isValueCorrectType,
  createList,
  doesRequestHaveRequiredParams,
} from '../../../common/helper';

import {
  isQuestionIdValid,
  getQuestionFromDatabase,
  doesQuestionHaveRequiredParams,
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
  doesQuestionsArrayHaveObjElements,
  doesQuestionsArrayElementsHaveRequiredParams,
  doesAddQuestionRequestHaveRequiredParams,
  doesEditQuestionRequestHaveRequiredParams,
  areQuestionsArrayElementsParamsCorrectTypes,
  areQuestionRequestParamsCorrectTypes,
  doesQuestionsArrayElementsHaveCorrectParamsForType,
  doesAddQuestionRequestHaveCorrectParamsForType,
  doesEditQuestionRequestHaveCorrectParamsForType,
};
