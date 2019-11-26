import express from 'express';
import { checkIfExamIdIsValid } from '../middleware';
import {
  doesRequestContainValidStudentId,
  doesAddStudentRequestHaveRequiredParams,
  doesEditStudentRequestHaveRequiredParams,
  doesSaveExamResultsRequestHaveRequiredParams,
  areAddStudentRequestParamsCorrectTypes,
  areEditStudentNameRequestParamsCorrectTypes,
  areSaveExamResultsRequestParamsCorrectTypes,
  doSaveExamResultsRequestArrayParamsHaveCorrectElements,
} from './middleware';
import {
  addStudent,
  editStudentName,
  deleteStudent,
  saveExamResults,
} from './controller';

const studentRoutes = express.Router();

studentRoutes
  .route('/:examId')
  .post(
    checkIfExamIdIsValid,
    doesAddStudentRequestHaveRequiredParams,
    areAddStudentRequestParamsCorrectTypes,
    addStudent,
  )
  .put(
    checkIfExamIdIsValid,
    doesRequestContainValidStudentId,
    doesEditStudentRequestHaveRequiredParams,
    areEditStudentNameRequestParamsCorrectTypes,
    editStudentName,
  )
  .delete(
    checkIfExamIdIsValid,
    doesRequestContainValidStudentId,
    deleteStudent,
  );

studentRoutes
  .route('/save-exam-results/:examId')
  .put(
    checkIfExamIdIsValid,
    doesSaveExamResultsRequestHaveRequiredParams,
    doesRequestContainValidStudentId,
    areSaveExamResultsRequestParamsCorrectTypes,
    doSaveExamResultsRequestArrayParamsHaveCorrectElements,
    saveExamResults,
  );

export default studentRoutes;
