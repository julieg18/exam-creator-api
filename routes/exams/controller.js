import Exam from '../../models/Exam';
import { getExamFromDatabase } from './helper';

async function addExamToDatabase(req, res) {
  const { title, creator, questions, students } = req.body;

  const examQuestions = questions.map((question) => {
    const { name, type, options, answer } = question;
    return {
      name,
      type,
      options,
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

async function addStudent(req, res) {
  const { examId } = req.params;
  const { name } = req.body;
  const newStudent = {
    name,
    takenTest: false,
  };
  const updatedExam = await Exam.findByIdAndUpdate(
    examId,
    { $push: { students: newStudent } },
    { useFindAndModify: false, new: true },
  );
  res.status(201);
  res.json({ message: 'student added', updatedExam });
}

async function editStudentName(req, res) {
  const exam = await getExamFromDatabase(req.params.examId);
  const student = exam.students.id(req.body.studentId);
  student.name = req.body.name ? req.body.name : student.name;
  await exam.save();
  res.status(200);
  res.json({ message: 'student name edited', updatedExam: exam });
}

async function deleteStudent(req, res) {
  const exam = await getExamFromDatabase(req.params.examId);
  exam.students.id(req.body.studentId).remove();
  await exam.save();
  res.status(200);
  res.json({ message: 'student deleted', updatedExam: exam });
}

async function saveExamResults(req, res) {
  const { studentId, questionsCorrect, questionsIncorrect } = req.body;
  const exam = await getExamFromDatabase(req.params.examId);
  const student = exam.students.id(studentId);
  student.questionsCorrect = questionsCorrect;
  student.questionsIncorrect = questionsIncorrect;
  student.questionsTaken = [...questionsIncorrect, ...questionsCorrect];
  student.takenTest = true;
  await exam.save();
  res.status(200);
  res.json({ message: 'exam results saved', updatedExam: exam });
}

export {
  addExamToDatabase,
  getExam,
  editExamTitle,
  deleteExamFromDatabase,
  addQuestion,
  editQuestion,
  deleteQuestion,
  addStudent,
  editStudentName,
  deleteStudent,
  saveExamResults,
};
