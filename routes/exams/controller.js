import Exam from '../../models/Exam';
import { getExamFromDatabase, getQuestionFromDatabase } from './helper';

async function addExamToDatabase(req, res) {
  const { title, creator, questions, students } = req.body;

  const examObject = {
    title,
    creator,
    numberOfQuestions: questions.length,
    questions,
    students,
  };

  const newExam = await new Exam(examObject).save().catch(() => {
    res.status(501);
    res.json({ error: 'could not create exam' });
  });
  res.status(201);
  res.json({ message: 'exam created', exam: newExam });
}

async function getExam(req, res) {
  const { examId } = req.params;
  const exam = await getExamFromDatabase(examId);
  res.status(200);
  res.json({ message: 'exam found', exam });
}

async function editExamTitle(req, res) {
  const { examId } = req.params;
  const { title } = req.body;
  const updatedExam = await Exam.findByIdAndUpdate(
    examId,
    { $set: { title } },
    { new: true, useFindAndModify: false },
  );
  res.status(200);
  res.json({ message: 'exam title updated', updatedExam });
}

async function deleteExamFromDatabase(req, res) {
  const { examId } = req.params;
  await Exam.findByIdAndDelete(examId);
  res.status(200);
  res.json({ message: 'exam deleted' });
}

async function addQuestion(req, res) {
  const { examId } = req.params;
  const { name, type, options, answer } = req.body;
  const question = {
    name,
    type,
    options,
    answer,
  };
  const updatedExam = await Exam.findByIdAndUpdate(
    examId,
    {
      $push: { questions: question },
      $inc: { numberOfQuestions: 1 },
    },
    { useFindAndModify: false, new: true },
  );
  res.status(201);
  res.json({ message: 'question added to exam', updatedExam });
}

async function editQuestion(req, res) {
  const questionParams = ['name', 'type', 'options', 'answer'];
  const exam = await getExamFromDatabase(req.params.examId);
  const question = exam.questions.id(req.body.questionId);
  questionParams.forEach((param) => {
    question[param] = req.body[param] ? req.body[param] : question[param];
  });
  await exam.save();
  res.status(200);
  res.json({ message: 'question edited', updatedExam: exam });
}

async function deleteQuestion(req, res) {
  const { examId } = req.params;
  const exam = await getExamFromDatabase(req.params.examId);
  exam.questions.id(req.body.questionId).remove();
  await exam.save();
  await Exam.findByIdAndUpdate(
    examId,
    { $inc: { numberOfQuestions: -1 } },
    { useFindAndModify: false, new: true },
  );
  res.status(200);
  res.json({ message: 'question deleted' });
}

export {
  addExamToDatabase,
  getExam,
  editExamTitle,
  deleteExamFromDatabase,
  addQuestion,
  editQuestion,
  deleteQuestion,
};
