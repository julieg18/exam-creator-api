import express from 'express';

import {
  checkIfExamIdIsValid,
  doesCreateExamRequestHaveRequiredParams,
  doesEditExamRequestHaveRequiredParams,
  areCreateExamRequestParamsCorrectTypes,
  isEditExamRequestParamCorrectType,
  checkIfQuestionIdIsValid,
  doesQuestionsArrayHaveObjElements,
  doesQuestionsArrayElementsHaveRequiredParams,
  doesAddQuestionRequestHaveRequiredParams,
  doesEditQuestionRequestHaveRequiredParams,
  areQuestionsArrayElementsParamsCorrectTypes,
  areQuestionRequestParamsCorrectTypes,
  doesQuestionsArrayElementsHaveCorrectParamsForType,
  doesAddQuestionRequestHaveCorrectParamsForType,
  doesEditQuestionRequestHaveCorrectParamsForType,
  doesStudentsArrayHaveObjElements,
  doesStudentsArrayElementsHaveRequiredParams,
  areStudentsArrayElementsParamsCorrectTypes,
  doesStudentArrayElementsHaveUniqueIds,
} from './middleware/index';
import {
  addExamToDatabase,
  getExam,
  editExamTitle,
  deleteExamFromDatabase,
  addQuestion,
  editQuestion,
  deleteQuestion,
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
    doesStudentArrayElementsHaveUniqueIds,
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

examRoutes
  .route('/questions/:examId')
  .post(
    checkIfExamIdIsValid,
    doesAddQuestionRequestHaveRequiredParams,
    areQuestionRequestParamsCorrectTypes,
    doesAddQuestionRequestHaveCorrectParamsForType,
    addQuestion,
  )
  .put(
    checkIfExamIdIsValid,
    doesEditQuestionRequestHaveRequiredParams,
    areQuestionRequestParamsCorrectTypes,
    doesEditQuestionRequestHaveCorrectParamsForType,
    checkIfQuestionIdIsValid,
    editQuestion,
  )
  .delete(checkIfExamIdIsValid, checkIfQuestionIdIsValid, deleteQuestion);

examRoutes
  .route('/students/:examId')
  .post((req, res) => {
    res.send('this route should add a student to a exam');
  })
  .put((req, res) => {
    res.send('this route should edit a exam student');
  })
  .delete((req, res) => {
    res.send('this route should delete a exam student');
  });

examRoutes.route('/user/:userId').get((req, res) => {
  res.send("this route should get a user's exam");
});

export default examRoutes;
