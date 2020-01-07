import {
  isValueCorrectType,
  createList,
  doesRequestHaveRequiredParams,
} from '../../common/helper';
import {
  isExamIdValid,
  doesQuestionHaveRequiredParams,
  doesStudentHaveRequiredParams,
  areQuestionParamsCorrectTypes,
  areStudentParamsCorrectTypes,
  getCheckboxQuestionPropertyValueErrors,
  getRadioQuestionPropertyValueErrors,
  getTrueOrFalseQuestionPropertyValueErrors,
} from './helper';

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
  const requiredExamParams = ['creator', 'title', 'questions', 'students'];
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

function doesStudentsArrayHaveObjElements(req, res, next) {
  const { students } = req.body;
  const doesStudentsArrHaveObjElements = students.every((student) =>
    isValueCorrectType(student, 'object'),
  );
  if (doesStudentsArrHaveObjElements) {
    next();
  } else {
    res.status(400);
    res.json({ error: 'students must be an array of objects' });
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

function doesStudentsArrayElementsHaveRequiredParams(req, res, next) {
  const { students } = req.body;
  const doesStudentsArrHaveRequiredParams = students.every((student) =>
    doesStudentHaveRequiredParams(student),
  );
  if (doesStudentsArrHaveRequiredParams) {
    next();
  } else {
    res.status(400);
    res.json({
      error: 'each student element must have a name property',
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

function areStudentsArrayElementsParamsCorrectTypes(req, res, next) {
  const { students } = req.body;
  const incorrectTypeParamErrs = [];
  students.forEach((student) => {
    const {
      doesStudentHaveCorrectTypes,
      incorrectTypeParamErrsArr,
    } = areStudentParamsCorrectTypes(student);
    if (!doesStudentHaveCorrectTypes) {
      incorrectTypeParamErrs.push(...incorrectTypeParamErrsArr);
    }
    return student;
  });
  if (incorrectTypeParamErrs.length === 0) {
    next();
  } else {
    const uniqueErrsSet = new Set(incorrectTypeParamErrs);
    res.status(400);
    res.json({
      error: `students' param values must be correct types: ${createList([
        ...uniqueErrsSet,
      ])}`,
    });
  }
}

function doesQuestionsArrayElementsHaveCorrectParamsForType(req, res, next) {
  const { questions } = req.body;
  const errorMessages = [];
  const typeTrueOrFalseErrors = [];
  const typeCheckBoxErrors = [];
  const typeRadioErrors = [];
  questions.forEach((question) => {
    switch (question.type) {
      case 'true_false':
        typeTrueOrFalseErrors.push(
          ...getTrueOrFalseQuestionPropertyValueErrors(question),
        );
        break;
      case 'checkbox':
        typeCheckBoxErrors.push(
          ...getCheckboxQuestionPropertyValueErrors(question),
        );
        break;
      case 'radio':
        typeRadioErrors.push(...getRadioQuestionPropertyValueErrors(question));
        break;
      default:
    }
  });
  if (typeTrueOrFalseErrors.length !== 0) {
    const typeTrueOrFalseErrorsSet = new Set(typeTrueOrFalseErrors);
    errorMessages.push(
      `for true_false type, ${createList([...typeTrueOrFalseErrorsSet])}`,
    );
  }
  if (typeRadioErrors.length !== 0) {
    const typeRadioErrorsSet = new Set(typeRadioErrors);
    errorMessages.push(
      `for radio type, ${createList([...typeRadioErrorsSet])}`,
    );
  }
  if (typeCheckBoxErrors.length !== 0) {
    const typeCheckBoxErrorsSet = new Set(typeCheckBoxErrors);
    errorMessages.push(
      `for checkbox type, ${createList([...typeCheckBoxErrorsSet])}`,
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
  doesQuestionsArrayHaveObjElements,
  doesStudentsArrayHaveObjElements,
  doesQuestionsArrayElementsHaveRequiredParams,
  doesStudentsArrayElementsHaveRequiredParams,
  areQuestionsArrayElementsParamsCorrectTypes,
  areStudentsArrayElementsParamsCorrectTypes,
  doesQuestionsArrayElementsHaveCorrectParamsForType,
  doesEditExamRequestHaveRequiredParams,
  areCreateExamRequestParamsCorrectTypes,
  isEditExamRequestParamCorrectType,
};
