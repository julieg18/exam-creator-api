import { isValueCorrectType, createList } from '../../../common/helper';
import {
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
      error:
        'each student element must have a name, studentId, and takenTest property',
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
  doesStudentsArrayHaveObjElements,
  doesStudentsArrayElementsHaveRequiredParams,
  areStudentsArrayElementsParamsCorrectTypes,
  doesStudentArrayElementsHaveUniqueIds,
};
