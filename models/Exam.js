const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const QuestionsSchema = new Schema = ({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  options: [String]
})

const studentsSchema = new Schema = ({
  name: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  takenTest: {
    type: Boolean,
    required: true,
  },
  results: String,
})

const ExamSchema = new Schema({
  creator: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  numberOfQuestions: {
    type: Number,
    required: true,
  },
  questions: [QuestionsSchema],
  students: [studentsSchema],
})

const Exam = model('Exam', ExamSchema);

module.exports = Exam;