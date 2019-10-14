import Exam from '../../models/Exam';

async function isExamIdValid(examId) {
  let isIdValid = false;
  try {
    const examCount = await Exam.countDocuments({ _id: examId });
    isIdValid = examCount === 1;
  } catch (err) {
    isIdValid = false;
  }
  return isIdValid;
}

async function getExamFromDatabase(examId) {
  const exam = await Exam.findById(examId);
  return exam;
}

export { isExamIdValid, getExamFromDatabase };
