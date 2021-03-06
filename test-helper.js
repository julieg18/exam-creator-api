import { assert } from 'chai';

const examObj = {
  creator: '12345',
  title: 'Math Test',
  questions: [
    {
      name: 'What is 2+2?',
      type: 'radio',
      options: [
        { name: '4', optionId: '123' },
        { name: '6', optionId: '124' },
      ],
      answer: ['123'],
    },
    {
      name: 'Which numbers are even?',
      type: 'checkbox',
      options: [
        { name: '6', optionId: '125' },
        { name: '4', optionId: '126' },
        { name: '5', optionId: '127' },
      ],
      answer: ['125', '126'],
    },
    {
      name: 'Is 7 even?',
      type: 'true_false',
      options: [],
      answer: ['false'],
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

const questionObj = {
  name: 'What is 5-2?',
  type: 'radio',
  options: [
    { name: '4', optionId: '127' },
    { name: '3', optionId: '128' },
    { name: '5', optionId: '129' },
  ],
  answer: ['129'],
};

const studentObj = {
  name: 'Susan',
};

const userSignupObj = {
  username: 'Nathan',
  email: 'nathan@icloud.com',
  password: 'nathaniscool',
};

const secondUserSignupObj = {
  username: 'James',
  email: 'james@gmail.com',
  password: 'jamesisanicename',
};

const userLoginObj = {
  email: 'nathan@icloud.com',
  password: 'nathaniscool',
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
    assert.isArray(question.answer);
    [('name', 'type', '_id')].forEach((prop) => {
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

function checkUser(user, signupObj) {
  assert.isObject(user);
  assert.containsAllKeys(user, ['_id', 'username', 'password', 'email']);
  assert.propertyVal(user, 'username', signupObj.username);
  assert.propertyVal(user, 'email', signupObj.email);
  assert.notPropertyVal(user, 'password', signupObj.password);
}

export {
  examObj,
  questionObj,
  studentObj,
  userSignupObj,
  secondUserSignupObj,
  userLoginObj,
  checkExam,
  checkExamQuestions,
  checkExamStudents,
  checkUser,
};
