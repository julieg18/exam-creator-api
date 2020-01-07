import Exam from '../../models/Exam';
import {
  isValueCorrectType,
  doesObjectHaveRequiredProperties,
} from '../../common/helper';

async function isExamIdValid(examId) {
  let isIdValid = false;
  try {
    const examCount = await Exam.countDocuments({ _id: examId });
    isIdValid = examCount === 1;
  } catch (err) {
    isIdValid = false;
  }
  return isIdValid;
}

async function isQuestionIdValid(examId, questionId) {
  const exam = await Exam.findById(examId);
  const isIdValid = exam.questions.some((question) => {
    return question._id == questionId;
  });
  return isIdValid;
}

async function isStudentIdValid(examId, studentId) {
  const exam = await Exam.findById(examId);
  const isIdValid = exam.students.some((student) => {
    return student._id == studentId;
  });
  return isIdValid;
}

async function getExamFromDatabase(examId) {
  const exam = await Exam.findById(examId);
  return exam;
}

async function getQuestionFromDatabase(examId, questionId) {
  const exam = await Exam.findById(examId);
  const requestedQuestion = exam.questions.find(
    (question) => question._id == questionId,
  );
  return requestedQuestion;
}

function doesQuestionHaveRequiredParams(question) {
  const requiredParams = ['name', 'type', 'options', 'answer'];
  const { doesObjHaveRequiredProps } = doesObjectHaveRequiredProperties(
    question,
    requiredParams,
  );
  return doesObjHaveRequiredProps;
}

function areQuestionParamsCorrectTypes(question) {
  const params = Object.keys(question);
  const incorrectTypeParamErrs = [];
  params.forEach((param) => {
    const paramValue = question[param];
    switch (param) {
      case 'questionId':
        if (!isValueCorrectType(paramValue, 'string')) {
          incorrectTypeParamErrs.push('questionId must be a string');
        }
        break;
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
        if (!isValueCorrectType(paramValue, 'array')) {
          incorrectTypeParamErrs.push('answer must be a array');
        }
        break;
      default:
        return param;
    }
    return param;
  });
  return {
    areQuestionParamsTheCorrectTypes: incorrectTypeParamErrs.length === 0,
    incorrectTypeParamErrsArr: incorrectTypeParamErrs,
  };
}

function getTrueOrFalseQuestionPropertyValueErrors(question) {
  const { options, answer } = question;
  const errors = [];

  if (answer[0] !== 'true' && answer[0] !== 'false') {
    errors.push("answer must contain a value of 'true' or 'false'");
  }
  if (options.length !== 0) {
    errors.push('options must be an empty array');
  }

  return errors;
}

function getRadioQuestionPropertyValueErrors(question) {
  const { options, answer } = question;
  const errors = [];

  const areOptionsValuesCorrectType = options.every((opt) => {
    return isValueCorrectType(opt, 'object');
  });
  const doOptionsObjectsHaveCorrectProps = options.every(
    (opt) =>
      doesObjectHaveRequiredProperties(opt, ['name', 'optionId'])
        .doesObjHaveRequiredProps,
  );
  const areOptionsObjectNamesCorrectType = options.every((opt) =>
    isValueCorrectType(opt.name, 'string'),
  );
  const areOptionsObjectOptionIdsCorrectType = options.every((opt) =>
    isValueCorrectType(opt.optionId, 'string'),
  );
  const optionIdArray = options.map((opt) => opt.optionId);
  const optionIdSet = new Set(optionIdArray);
  const areOptionsObjectOptionsIdsUnique =
    optionIdArray.length === optionIdSet.size;

  const doesAnswerContainOptionId = options.some(
    (opt) => opt.optionId === answer[0],
  );

  if (options.length === 0) {
    errors.push('options must not be an empty array');
  }
  if (!areOptionsValuesCorrectType || !doOptionsObjectsHaveCorrectProps) {
    errors.push(
      'options must be filled with objects(each object containing a name property and a optionId property)',
    );
  }
  if (!areOptionsObjectNamesCorrectType) {
    errors.push('the options name properties must be strings');
  }
  if (
    !areOptionsObjectOptionIdsCorrectType ||
    !areOptionsObjectOptionsIdsUnique
  ) {
    errors.push('the options optionId properties must be unique strings');
  }

  if (!doesAnswerContainOptionId) {
    errors.push('the options answer property must contain one optionId');
  }

  return errors;
}

function getCheckboxQuestionPropertyValueErrors(question) {
  const { options, answer } = question;
  const errors = [];

  const areOptionsValuesCorrectType = options.every((opt) =>
    isValueCorrectType(opt, 'object'),
  );
  const doOptionsObjectsHaveCorrectProps = options.every(
    (opt) =>
      doesObjectHaveRequiredProperties(opt, ['name', 'optionId'])
        .doesObjHaveRequiredProps,
  );
  const areOptionsObjectNamesCorrectType = options.every((opt) =>
    isValueCorrectType(opt.name, 'string'),
  );
  const areOptionsObjectOptionIdsCorrectType = options.every((opt) =>
    isValueCorrectType(opt.optionId, 'string'),
  );
  const optionIdArray = options.map((opt) => opt.optionId);
  const optionIdSet = new Set(optionIdArray);
  const areOptionsObjectOptionsIdsUnique =
    optionIdArray.length === optionIdSet.size;

  const doesAnswerContainOptionIds = answer.every((string) =>
    options.some((opt) => opt.optionId === string),
  );

  if (options.length === 0) {
    errors.push('options must not be an empty array');
  }
  if (!areOptionsValuesCorrectType || !doOptionsObjectsHaveCorrectProps) {
    errors.push(
      'options must be filled with objects, each object containing a name property and a optionId property',
    );
  }
  if (!areOptionsObjectNamesCorrectType) {
    errors.push('the options name properties must be strings');
  }
  if (
    !areOptionsObjectOptionIdsCorrectType ||
    !areOptionsObjectOptionsIdsUnique
  ) {
    errors.push('the options optionId properties must be unique strings');
  }

  if (!doesAnswerContainOptionIds) {
    errors.push(
      'the options answer property must be filled with at least one optionId',
    );
  }

  return errors;
}

function doesStudentHaveRequiredParams(student) {
  const requiredParams = ['name'];
  const { doesObjHaveRequiredProps } = doesObjectHaveRequiredProperties(
    student,
    requiredParams,
  );
  return doesObjHaveRequiredProps;
}

function areStudentParamsCorrectTypes(student) {
  const incorrectTypeParamErrs = [];
  const params = Object.keys(student);
  params.forEach((param) => {
    const paramValue = student[param];
    switch (param) {
      case 'name':
        if (!isValueCorrectType(paramValue, 'string')) {
          incorrectTypeParamErrs.push('name must be a string');
        }
        break;
      case 'takenTest':
        if (!isValueCorrectType(paramValue, 'boolean')) {
          incorrectTypeParamErrs.push('takenTest must be an boolean');
        }
        break;
      case 'studentId':
        if (!isValueCorrectType(paramValue, 'string')) {
          incorrectTypeParamErrs.push('studentId must be a string');
        }
        break;
      case 'questionsTaken':
        if (!isValueCorrectType(paramValue, 'array')) {
          incorrectTypeParamErrs.push('questionsTaken must be an array');
        }
        break;
      case 'questionsCorrect':
        if (!isValueCorrectType(paramValue, 'array')) {
          incorrectTypeParamErrs.push('questionsCorrect must be an array');
        }
        break;
      case 'questionsIncorrect':
        if (!isValueCorrectType(paramValue, 'array')) {
          incorrectTypeParamErrs.push('questionsIncorrect must be an array');
        }
        break;
      default:
        return param;
    }
    return param;
  });
  const incorrectTypeParamErrsSet = new Set(incorrectTypeParamErrs);
  const incorrectTypeParamErrsArr = [...incorrectTypeParamErrsSet];
  return {
    doesStudentHaveCorrectTypes: incorrectTypeParamErrs.length === 0,
    incorrectTypeParamErrsArr,
  };
}

export {
  isExamIdValid,
  isQuestionIdValid,
  isStudentIdValid,
  getExamFromDatabase,
  getQuestionFromDatabase,
  doesQuestionHaveRequiredParams,
  areQuestionParamsCorrectTypes,
  getCheckboxQuestionPropertyValueErrors,
  getRadioQuestionPropertyValueErrors,
  getTrueOrFalseQuestionPropertyValueErrors,
  doesStudentHaveRequiredParams,
  areStudentParamsCorrectTypes,
};
