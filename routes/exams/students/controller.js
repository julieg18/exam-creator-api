import Exam from '../../../models/Exam';
import { getExamFromDatabase } from '../helper';

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

export { addStudent, editStudentName, deleteStudent, saveExamResults };
