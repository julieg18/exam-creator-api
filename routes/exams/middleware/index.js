import {
  checkIfExamIdIsValid,
  doesCreateExamRequestHaveRequiredParams,
  areCreateExamRequestParamsCorrectTypes,
} from './examValidation';
import {
  doesQuestionsArrayHaveObjElements,
  doesQuestionsArrayElementsHaveRequiredParams,
  areQuestionsArrayElementsParamsCorrectTypes,
  doesQuestionsArrayElementsHaveCorrectParamsForType,
} from './questionsValidation';
import {
  doesStudentsArrayHaveObjElements,
  doesStudentsArrayElementsHaveRequiredParams,
  areStudentsArrayElementsParamsCorrectTypes,
  doesStudentArrayElementsHaveUniqueIds,
} from './studentsValidation';

export {
  checkIfExamIdIsValid,
  doesCreateExamRequestHaveRequiredParams,
  areCreateExamRequestParamsCorrectTypes,
  doesQuestionsArrayHaveObjElements,
  doesQuestionsArrayElementsHaveRequiredParams,
  areQuestionsArrayElementsParamsCorrectTypes,
  doesQuestionsArrayElementsHaveCorrectParamsForType,
  doesStudentsArrayHaveObjElements,
  doesStudentsArrayElementsHaveRequiredParams,
  areStudentsArrayElementsParamsCorrectTypes,
  doesStudentArrayElementsHaveUniqueIds,
};
