import Exam from '../../../models/Exam';
import { getExamFromDatabase } from '../helper';

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
      $set: { lastUpdated: Date.now() },
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
  const updatedExam = await Exam.findByIdAndUpdate(
    exam._id,
    { $set: { lastUpdated: Date.now() } },
    { useFindAndModify: false, new: true },
  );
  res.status(200);
  res.json({ message: 'question edited', updatedExam });
}

async function deleteQuestion(req, res) {
  const { examId } = req.params;
  const exam = await getExamFromDatabase(req.params.examId);
  exam.questions.id(req.body.questionId).remove();
  await exam.save();
  await Exam.findByIdAndUpdate(
    examId,
    { $inc: { numberOfQuestions: -1 }, $set: { lastUpdated: Date.now() } },
    { useFindAndModify: false, new: true },
  );
  res.status(200);
  res.json({ message: 'question deleted' });
}

export { addQuestion, editQuestion, deleteQuestion };
