import {
  isValueCorrectType,
  doesObjectHaveRequiredProperties,
  createList,
} from '../../../common/helper';

function doesCreateExamRequestHaveRequiredParams(req, res, next) {
  const requiredExamParams = ['creator', 'title', 'numberOfQuestions'];
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
  const doesStudentsArrHaveObjElements = students.every((student) => {
    return isValueCorrectType(student, 'object');
  });
  if (doesStudentsArrHaveObjElements) {
    next();
  } else {
    res.status(400);
    res.json({ error: 'students must be an array of objects' });
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

function doesStudentsArrayElementsHaveRequiredParams(req, res, next) {
  const { students } = req.body;
  const requiredParams = ['name', 'studentId', 'takenTest'];
  const doesStudentsArrHaveRequiredParams = students.every((student) => {
    const { doesObjHaveRequiredProps } = doesObjectHaveRequiredProperties(
      student,
      requiredParams,
    );
    return doesObjHaveRequiredProps;
  });
  if (doesStudentsArrHaveRequiredParams) {
    next();
  } else {
    res.status(400);
    res.json({
      error:
        'each student element must have a name, studentId, and takenTest property',
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

function areStudentsArrayElementsParamsCorrectTypes(req, res, next) {
  const { students } = req.body;
  const incorrectTypeParamErrs = [];
  students.forEach((student) => {
    const params = Object.keys(student);
    params.forEach((param) => {
      const paramValue = student[param];
      switch (param) {
        case 'name':
          if (!isValueCorrectType(paramValue, 'string')) {
            incorrectTypeParamErrs.push('name must be a string');
          }
          break;
        case 'studentId':
          if (!isValueCorrectType(paramValue, 'string')) {
            incorrectTypeParamErrs.push('studentId must be a string');
          }
          break;
        case 'takenTest':
          if (!isValueCorrectType(paramValue, 'boolean')) {
            incorrectTypeParamErrs.push('takenTest must be an boolean');
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

function doesStudentArrayElementsHaveUniqueIds(req, res, next) {
  const { students } = req.body;
  const studentIdsArr = students.map((student) => student.studentId);
  const studentIdsSet = new Set(studentIdsArr);
  if (studentIdsSet.size === studentIdsArr.length) {
    next();
  } else {
    res.status(400);
    res.json({
      error: 'studentIds must be unique',
    });
  }
}

export {
  doesCreateExamRequestHaveRequiredParams,
  areCreateExamRequestParamsCorrectTypes,
  doesQuestionsArrayHaveObjElements,
  doesStudentsArrayHaveObjElements,
  doesQuestionsArrayElementsHaveRequiredParams,
  doesStudentsArrayElementsHaveRequiredParams,
  areQuestionsArrayElementsParamsCorrectTypes,
  areStudentsArrayElementsParamsCorrectTypes,
  doesQuestionsArrayElementsHaveCorrectParamsForType,
  doesStudentArrayElementsHaveUniqueIds,
};
