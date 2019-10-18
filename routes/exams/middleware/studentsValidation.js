import {
  isValueCorrectType,
  createList,
  doesRequestHaveRequiredParams,
} from '../../../common/helper';
import {
  isStudentIdValid,
  doesStudentHaveRequiredParams,
  areStudentParamsCorrectTypes,
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
    // next();
    res.send('next');
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
    const error = `${errorMessage}`;
    res.json({ error });
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

export {
  doesStudentsArrayHaveObjElements,
  doesRequestContainValidStudentId,
  doesStudentsArrayElementsHaveRequiredParams,
  doesAddStudentRequestHaveRequiredParams,
  areStudentsArrayElementsParamsCorrectTypes,
  areAddStudentRequestParamsCorrectTypes,
};
