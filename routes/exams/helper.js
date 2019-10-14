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

async function getExamFromDatabase(examId) {
  const exam = await Exam.findById(examId);
  return exam;
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
  const incorrectTypeParamErrsSet = new Set(incorrectTypeParamErrs);
  return {
    areQuestionParamsTheCorrectTypes: incorrectTypeParamErrsSet.size === 0,
    incorrectTypeParamErrsArr: [...incorrectTypeParamErrsSet],
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

export {
  isExamIdValid,
  getExamFromDatabase,
  doesQuestionHaveRequiredParams,
  areQuestionParamsCorrectTypes,
  doesQuestionHaveCorrectParamsForType,
};
