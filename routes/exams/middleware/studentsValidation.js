import {
  isValueCorrectType,
  doesObjectHaveRequiredProperties,
  createList,
} from '../../../common/helper';

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
