import express from 'express';
import { checkIfExamIdIsValid } from '../middleware';
import {
  checkIfQuestionIdIsValid,
  doesAddQuestionRequestHaveRequiredParams,
  doesEditQuestionRequestHaveRequiredParams,
  areQuestionRequestParamsCorrectTypes,
  doesAddQuestionRequestHaveCorrectParamsForType,
  doesEditQuestionRequestHaveCorrectParamsForType,
} from './middleware';
import { addQuestion, editQuestion, deleteQuestion } from './controller';

const questionRoutes = express.Router();

questionRoutes
  .route('/:examId')
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

export default questionRoutes;
