import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const QuestionsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  options: [{ type: String, required: true }],
  answer: {
    type: String,
    required: true,
  },
});

const StudentsSchema = new Schema({
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
});

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
  students: [StudentsSchema],
});

const Exam = model('Exam', ExamSchema);

export default Exam;
