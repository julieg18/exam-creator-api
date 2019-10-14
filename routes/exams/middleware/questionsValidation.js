import {
  isValueCorrectType,
  doesObjectHaveRequiredProperties,
  createList,
} from '../../../common/helper';

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
  const requiredParams = ['name', 'type', 'options', 'answer'];
  const doesQuestionsArrHaveRequiredParams = questions.every((question) => {
    const { doesObjHaveRequiredProps } = doesObjectHaveRequiredProperties(
      question,
      requiredParams,
    );
    return doesObjHaveRequiredProps;
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
    const params = Object.keys(question);
    params.forEach((param) => {
      const paramValue = question[param];
      switch (param) {
        case 'name':
          if (!isValueCorrectType(paramValue, 'string')) {
            incorrectTypeParamErrs.push('name must be a string');
          }
          break;
        case 'type':
          if (
            paramValue !== 'radio' &&
            paramValue !== 'checkbox' &&
            paramValue !== 'true_false'
          ) {
            incorrectTypeParamErrs.push(
              "question type param must equal 'radio', 'checkbox', or 'true_false'",
            );
          }
          break;
        case 'options':
          if (!isValueCorrectType(paramValue, 'array')) {
            incorrectTypeParamErrs.push('options must be an array');
          }
          break;
        case 'answer':
          if (!isValueCorrectType(paramValue, 'string')) {
            incorrectTypeParamErrs.push('answer must be a string');
          }
          break;
        default:
          return param;
      }
    });
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
    const { type, options, answer } = question;
    if (type === 'true_false') {
      if (answer !== 'true' && answer !== 'false') {
        typeTrueOrFalseErrors.push("answer must be 'true' or 'false'");
      }
      if (options.length !== 0) {
        typeTrueOrFalseErrors.push('options must be an empty array');
      }
    } else {
      if (options.length === 0) {
        typeRadioOrCheckBoxErrors.push('options must not be a empty array');
      }
      if (!options.includes(answer)) {
        typeRadioOrCheckBoxErrors.push('options must include answer');
      }
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

export {
  doesQuestionsArrayHaveObjElements,
  doesQuestionsArrayElementsHaveRequiredParams,
  areQuestionsArrayElementsParamsCorrectTypes,
  doesQuestionsArrayElementsHaveCorrectParamsForType,
};
