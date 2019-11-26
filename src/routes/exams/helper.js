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
        if (!isValueCorrectType(paramValue, 'string')) {
          incorrectTypeParamErrs.push('answer must be a string');
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

function doesQuestionHaveCorrectParamsForType(question) {
  const { type, options, answer } = question;
  const typeTrueOrFalseErrors = [];
  const typeRadioOrCheckBoxErrors = [];
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
  const typeTrueOrFalseErrorsSet = new Set(typeTrueOrFalseErrors);
  const typeRadioOrCheckBoxErrorsSet = new Set(typeRadioOrCheckBoxErrors);
  return {
    doTrueOrFalseErrorsExist: typeTrueOrFalseErrorsSet.size !== 0,
    doRadioOrCheckBoxErrorsExist: typeRadioOrCheckBoxErrorsSet.size !== 0,
    typeTrueOrFalseErrorsArr: [...typeTrueOrFalseErrorsSet],
    typeRadioOrCheckBoxErrorsArr: [...typeRadioOrCheckBoxErrorsSet],
  };
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
  doesQuestionHaveCorrectParamsForType,
  doesStudentHaveRequiredParams,
  areStudentParamsCorrectTypes,
};