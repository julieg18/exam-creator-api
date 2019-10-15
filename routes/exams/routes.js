import express from 'express';

import {
  checkIfExamIdIsValid,
  doesCreateExamRequestHaveRequiredParams,
  doesEditExamRequestHaveRequiredParams,
  areCreateExamRequestParamsCorrectTypes,
  isEditExamRequestParamCorrectType,
  doesQuestionsArrayHaveObjElements,
  doesQuestionsArrayElementsHaveRequiredParams,
  areQuestionsArrayElementsParamsCorrectTypes,
  doesQuestionsArrayElementsHaveCorrectParamsForType,
  doesAddQuestionRequestHaveRequiredParams,
  areAddQuestionRequestParamsCorrectTypes,
  doesAddQuestionRequestHaveCorrectParamsForType,
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
    areAddQuestionRequestParamsCorrectTypes,
    doesAddQuestionRequestHaveCorrectParamsForType,
    addQuestion,
  )
  .put((req, res) => {
    res.send('this route should edit a exam question');
  })
  .delete((req, res) => {
    res.send('this route should delete a exam question');
  });

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
