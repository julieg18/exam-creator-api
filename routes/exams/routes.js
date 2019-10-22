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
  doesRequestContainValidStudentId,
  doesStudentsArrayElementsHaveRequiredParams,
  doesAddStudentRequestHaveRequiredParams,
  areStudentsArrayElementsParamsCorrectTypes,
  areAddStudentRequestParamsCorrectTypes,
  areEditStudentNameRequestParamsCorrectTypes,
} from './middleware/index';
import {
  addExamToDatabase,
  getExam,
  editExamTitle,
  deleteExamFromDatabase,
  addQuestion,
  editQuestion,
  deleteQuestion,
  addStudent,
  editStudentName,
  deleteStudent,
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
    checkIfQuestionIdIsValid,
    doesEditQuestionRequestHaveRequiredParams,
    areQuestionRequestParamsCorrectTypes,
    doesEditQuestionRequestHaveCorrectParamsForType,
    editQuestion,
  )
  .delete(checkIfExamIdIsValid, checkIfQuestionIdIsValid, deleteQuestion);

examRoutes
  .route('/students/:examId')
  .post(
    checkIfExamIdIsValid,
    doesAddStudentRequestHaveRequiredParams,
    areAddStudentRequestParamsCorrectTypes,
    addStudent,
  )
  .put(
    checkIfExamIdIsValid,
    doesRequestContainValidStudentId,
    areEditStudentNameRequestParamsCorrectTypes,
    editStudentName,
  )
  .delete(
    checkIfExamIdIsValid,
    doesRequestContainValidStudentId,
    deleteStudent,
  );

examRoutes.route('/students/completedExam/examId').put((req, res) => {
  res.send(
    "this route should edit a student's profile when they complete a exam",
  );
});

examRoutes.route('/user/:userId').get((req, res) => {
  res.send("this route should get a user's exam");
});

export default examRoutes;
