import Exam from '../../models/Exam';
import { getExamFromDatabase } from './helper';

async function addExamToDatabase(req, res) {
  const { title, creator, questions, students } = req.body;

  const examQuestions = questions.map((question) => {
    const { name, type, options, answer } = question;
    const questionOptions = options.map((opt) => ({
      name: opt.name,
      optionId: opt.optionId,
    }));
    return {
      name,
      type,
      options: questionOptions,
      answer,
    };
  });
  const studentQuestions = students.map((student) => {
    const { name } = student;
    return {
      name,
      takenTest: false,
    };
  });

  const examObject = {
    title,
    creator,
    lastUpdated: Date.now(),
    numberOfQuestions: questions.length,
    questions: examQuestions,
    students: studentQuestions,
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
    { $set: { title, lastUpdated: Date.now() } },
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

export { addExamToDatabase, getExam, editExamTitle, deleteExamFromDatabase };
