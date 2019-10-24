import { assert } from 'chai';

const examObj = {
  creator: '12345',
  title: 'Math Test',
  questions: [
    {
      name: 'What is 2+2?',
      type: 'radio',
      options: ['4', '6'],
      answer: '4',
    },
    {
      name: 'What is 4+2?',
      type: 'radio',
      options: ['4', '6'],
      answer: '6',
    },
    {
      name: 'Is 7 even?',
      type: 'true_false',
      options: [],
      answer: 'false',
    },
  ],
  students: [
    {
      name: 'James',
    },
    {
      name: 'Timothy',
    },
  ],
};

const studentObj = {
  name: 'Susan',
};

function checkExam(exam) {
  assert.hasAllKeys(exam, [
    '_id',
    'numberOfQuestions',
    'creator',
    'lastUpdated',
    'title',
    'questions',
    'students',
    '__v',
  ]);
  ['_id', 'creator', 'title'].forEach((prop) => {
    assert.isString(exam[prop]);
  });
  assert.isNumber(exam.numberOfQuestions);
}

function checkExamQuestions(questions) {
  assert.isArray(questions);
  questions.forEach((question) => {
    assert.isObject(question);
  });
  questions.forEach((question) => {
    assert.hasAllKeys(question, ['options', 'name', 'type', 'answer', '_id']);
    assert.isArray(question.options);
    ['name', 'type', '_id', 'answer'].forEach((prop) => {
      assert.isString(question[prop]);
    });
  });
}

function checkExamStudents(students) {
  assert.isArray(students);
  students.forEach((student) => {
    assert.isObject(student);
  });
  students.forEach((student) => {
    assert.hasAllKeys(student, [
      'name',
      'questionsTaken',
      'questionsCorrect',
      'questionsIncorrect',
      'takenTest',
      '_id',
    ]);
    ['name', '_id'].forEach((prop) => {
      assert.isString(student[prop]);
    });
    assert.isBoolean(student.takenTest);
    [('questionsTaken', 'questionsCorrect', 'questionsIncorrect')].forEach(
      (prop) => {
        assert.isArray(student[prop]);
      },
    );
  });
}

export {
  examObj,
  studentObj,
  checkExam,
  checkExamQuestions,
  checkExamStudents,
};
