import Exam from '../../models/Exam';

async function addExamToDatabase(req, res) {
  const { title, creator, numberOfQuestions, questions, students } = req.body;

  const examObject = {
    title,
    creator,
    numberOfQuestions,
    questions,
    students,
  };

  const newExam = await new Exam(examObject).save().catch((err) => {
    console.log('err', err);
  });
  res.json({ message: 'exam created', exam: newExam });
}

export { addExamToDatabase };
