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

async function deleteExamFromDatabase(req, res) {
  const { examId } = req.params;
  await Exam.findByIdAndDelete(examId);
  res.status(200);
  res.json({ message: 'exam deleted' });
}

export { addExamToDatabase, getExam, deleteExamFromDatabase };
