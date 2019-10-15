import Exam from '../../models/Exam';
import { getExamFromDatabase } from './helper';

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
  res.status(201);
  res.json({ message: 'question added to exam', exam: 'exam here' });
}

export {
  addExamToDatabase,
  getExam,
  editExamTitle,
  deleteExamFromDatabase,
  addQuestion,
};
