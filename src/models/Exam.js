import mongoose from 'mongoose';
import shortid from 'shortid';

const { Schema, model } = mongoose;

const OptionsSchema = new Schema({
  name: { type: String, required: true },
  optionId: { type: String, required: true },
});

const QuestionsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  options: [OptionsSchema],
  answer: [{ type: String, required: true }],
});

const StudentsSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  name: {
    type: String,
    required: true,
  },
  takenTest: {
    type: Boolean,
    required: true,
  },
  tookTest: Date,
  questionsTaken: [String],
  questionsCorrect: [String],
  questionsIncorrect: [String],
  score: String,
});

const ExamSchema = new Schema({
  creator: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
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
