import express from 'express';
import {
  checkIfExamIdIsValid,
  doesCreateExamRequestHaveRequiredParams,
  doesEditExamRequestHaveRequiredParams,
  areCreateExamRequestParamsCorrectTypes,
  isEditExamRequestParamCorrectType,
  doesQuestionsArrayHaveObjElements,
  doesStudentsArrayHaveObjElements,
  doesQuestionsArrayElementsHaveRequiredParams,
  doesStudentsArrayElementsHaveRequiredParams,
  areQuestionsArrayElementsParamsCorrectTypes,
  areStudentsArrayElementsParamsCorrectTypes,
  doesQuestionsArrayElementsHaveCorrectParamsForType,
} from './middleware';
import {
  addExamToDatabase,
  getExam,
  editExamTitle,
  deleteExamFromDatabase,
} from './controller';

const examRoutes = express.Router();

examRoutes
  .route('/')
  .post(
    doesCreateExamRequestHaveRequiredParams,
    areCreateExamRequestParamsCorrectTypes,
    doesQuestionsArrayHaveObjElements,
    doesStudentsArrayHaveObjElements,
    doesQuestionsArrayElementsHaveRequiredParams,
    doesStudentsArrayElementsHaveRequiredParams,
    areQuestionsArrayElementsParamsCorrectTypes,
    areStudentsArrayElementsParamsCorrectTypes,
    doesQuestionsArrayElementsHaveCorrectParamsForType,
    addExamToDatabase,
  );

examRoutes
  .route('/:examId')
  .get(checkIfExamIdIsValid, getExam)
  .put(
    checkIfExamIdIsValid,
    doesEditExamRequestHaveRequiredParams,
    isEditExamRequestParamCorrectType,
    editExamTitle,
  )
  .delete(checkIfExamIdIsValid, deleteExamFromDatabase);

export default examRoutes;
