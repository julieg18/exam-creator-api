import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import clonedeep from 'lodash.clonedeep';
import app from '../server';

chai.use(chaiHttp);
chai.should();

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
let examId = '';

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

describe('/api/v1/exams', () => {
  describe('POST', () => {
    it('should create a exam with required params', (done) => {
      chai
        .request(app)
        .post('/api/v1/exams')
        .send(examObj)
        .end((err, res) => {
          const { exam } = res.body;
          const { questions, students } = exam;
          examId = exam._id;
          res.should.have.status(201);
          assert.hasAllKeys(res.body, ['message', 'exam']);
          checkExam(exam);
          checkExamQuestions(questions);
          checkExamStudents(students);
          done();
        });
    });

    it('should throw an error if a required param is missing', (done) => {
      const missingParamExamObj = clonedeep(examObj);
      delete missingParamExamObj.creator;
      chai
        .request(app)
        .post('/api/v1/exams')
        .send(missingParamExamObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'creator is required');
          done();
        });
    });

    it('should throw an error if param is wrong type', (done) => {
      const wrongParamTypeExamObj = clonedeep(examObj);
      wrongParamTypeExamObj.creator = ['12345'];
      chai
        .request(app)
        .post('/api/v1/exams')
        .send(wrongParamTypeExamObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'creator must be a string');
          done();
        });
    });

    it('should throw an error is questions are incorrectly made', (done) => {
      const incorrectlyWrittenQuestionExamObj = clonedeep(examObj);
      incorrectlyWrittenQuestionExamObj.questions[0].type = 'true_false';
      chai
        .request(app)
        .post('/api/v1/exams')
        .send(incorrectlyWrittenQuestionExamObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(
            res.body.error,
            "questions' params must have correct values for type: for true_false type, answer must be 'true' or 'false' and options must be an empty array",
          );
          done();
        });
    });
  });
});

describe('/api/v1/exams/{examId}', () => {
  describe('GET', () => {
    it('should get a exam with a valid id', (done) => {
      chai
        .request(app)
        .get(`/api/v1/exams/${examId}`)
        .end((err, res) => {
          const { message, exam } = res.body;
          const { questions, students } = exam;
          res.should.have.status(200);
          assert.hasAllKeys(res.body, ['message', 'exam']);
          assert.equal(message, 'exam found');
          checkExam(exam);
          checkExamQuestions(questions);
          checkExamStudents(students);
          done();
        });
    });

    it('should throw an error if examId is invalid', (done) => {
      chai
        .request(app)
        .get('/api/v1/exams/invalid-id')
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'invalid examId');
          done();
        });
    });
  });

  describe('PUT', () => {
    it('should edit exam title if id is valid and title param exists', (done) => {
      chai
        .request(app)
        .put(`/api/v1/exams/${examId}`)
        .send({ title: 'Basic Math Test' })
        .end((err, res) => {
          const { message, updatedExam } = res.body;
          const { questions, students } = updatedExam;
          res.should.have.status(200);
          assert.hasAllKeys(res.body, ['message', 'updatedExam']);
          assert.equal(message, 'exam title updated');
          checkExam(updatedExam);
          checkExamQuestions(questions);
          checkExamStudents(students);
          assert.equal(updatedExam.title, 'Basic Math Test');
          done();
        });
    });

    it('should throw an error if examId is invalid', (done) => {
      chai
        .request(app)
        .put('/api/v1/exams/invalid-id')
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'invalid examId');
          done();
        });
    });

    it('should throw an error if title param is missing', (done) => {
      chai
        .request(app)
        .put(`/api/v1/exams/${examId}`)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'title is required');
          done();
        });
    });

    it('should throw an error if title is not a string', (done) => {
      chai
        .request(app)
        .put(`/api/v1/exams/${examId}`)
        .send({ title: { updatedTitle: 'Basic Math Test' } })
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'title must be a string');
          done();
        });
    });
  });

  describe('DELETE', () => {
    it('should delete the exam with a valid id', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/exams/${examId}`)
        .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body.message, 'exam deleted');
          done();
        });
    });
  });

  it('should throw an error if examId is invalid', (done) => {
    chai
      .request(app)
      .put('/api/v1/exams/invalid-id')
      .end((err, res) => {
        res.should.have.status(400);
        assert.equal(res.body.error, 'invalid examId');
        done();
      });
  });
});
