import {
  isValueCorrectType,
  createList,
  doesRequestHaveRequiredParams,
} from '../../../common/helper';
import {
  isStudentIdValid,
  doesStudentHaveRequiredParams,
  areStudentParamsCorrectTypes,
  getExamFromDatabase,
} from '../helper';

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

async function doesRequestContainValidStudentId(req, res, next) {
  const { examId } = req.params;
  const { studentId } = req.body;
  const isIdValid = await isStudentIdValid(examId, studentId);
  if (isIdValid) {
    next();
  } else {
    res.status(400);
    res.json({ error: 'invalid studentId' });
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

function doesAddStudentRequestHaveRequiredParams(req, res, next) {
  const requiredParams = ['name'];
  const {
    doesReqHaveRequiredParams,
    errorMessage,
  } = doesRequestHaveRequiredParams(requiredParams, req.body);
  if (doesReqHaveRequiredParams) {
    next();
  } else {
    res.status(400);
    res.json({ error: errorMessage });
  }
}

function doesEditStudentRequestHaveRequiredParams(req, res, next) {
  const requiredParams = ['studentId', 'name'];
  const {
    doesReqHaveRequiredParams,
    errorMessage,
  } = doesRequestHaveRequiredParams(requiredParams, req.body);
  if (doesReqHaveRequiredParams) {
    next();
  } else {
    res.status(400);
    res.json({ error: errorMessage });
  }
}

function doesSaveExamResultsRequestHaveRequiredParams(req, res, next) {
  const requiredParams = [
    'studentId',
    'questionsCorrect',
    'questionsIncorrect',
  ];
  const {
    doesReqHaveRequiredParams,
    errorMessage,
  } = doesRequestHaveRequiredParams(requiredParams, req.body);
  if (doesReqHaveRequiredParams) {
    next();
  } else {
    res.status(400);
    res.json({ error: errorMessage });
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

function areAddStudentRequestParamsCorrectTypes(req, res, next) {
  const {
    doesStudentHaveCorrectTypes,
    incorrectTypeParamErrsArr,
  } = areStudentParamsCorrectTypes(req.body);
  if (doesStudentHaveCorrectTypes) {
    next();
  } else {
    res.status(400);
    res.json({
      error: `${createList(incorrectTypeParamErrsArr)}`,
    });
  }
}

function areEditStudentNameRequestParamsCorrectTypes(req, res, next) {
  const { name } = req.body;
  if (isValueCorrectType(name, 'string')) {
    next();
  } else {
    res.status(400);
    res.json({ error: 'name must be a string' });
  }
}

function areSaveExamResultsRequestParamsCorrectTypes(req, res, next) {
  const { questionsIncorrect, questionsCorrect } = req.body;
  const reqObj = {
    questionsIncorrect,
    questionsCorrect,
  };
  const {
    doesStudentHaveCorrectTypes,
    incorrectTypeParamErrsArr,
  } = areStudentParamsCorrectTypes(reqObj);
  if (doesStudentHaveCorrectTypes) {
    next();
  } else {
    res.status(400);
    res.json({ error: createList(incorrectTypeParamErrsArr) });
  }
}

async function doSaveExamResultsRequestArrayParamsHaveCorrectElements(
  req,
  res,
  next,
) {
  const errorMessages = [];
  const { questionsIncorrect, questionsCorrect } = req.body;
  const exam = await getExamFromDatabase(req.params.examId);
  const sortedExamQuestionIds = exam.questions
    .map((question) => question._id)
    .sort();
  const sortedRequestQuestionIds = [
    ...questionsIncorrect,
    ...questionsCorrect,
  ].sort();

  if (sortedRequestQuestionIds.join('') !== sortedExamQuestionIds.join('')) {
    errorMessages.push(
      'questionsIncorrect must contain the questionIds of the questions that the student got incorrect and questionsCorrect must contain the questionIds of the questions that the student got correct',
    );
  }
  if (errorMessages.length === 0) {
    next();
  } else {
    res.status(400);
    res.json({ error: errorMessages });
  }
}

export {
  doesStudentsArrayHaveObjElements,
  doesRequestContainValidStudentId,
  doesStudentsArrayElementsHaveRequiredParams,
  doesAddStudentRequestHaveRequiredParams,
  doesEditStudentRequestHaveRequiredParams,
  doesSaveExamResultsRequestHaveRequiredParams,
  areStudentsArrayElementsParamsCorrectTypes,
  areAddStudentRequestParamsCorrectTypes,
  areEditStudentNameRequestParamsCorrectTypes,
  areSaveExamResultsRequestParamsCorrectTypes,
  doSaveExamResultsRequestArrayParamsHaveCorrectElements,
};
