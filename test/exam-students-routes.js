import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import {
  examObj,
  studentObj,
  checkExam,
  checkExamQuestions,
  checkExamStudents,
} from '../test-helper';

chai.use(chaiHttp);
chai.should();

let examId = '';
let studentId = '';
let saveExamResultsObj = {};

describe('/api/v1/exams/students/:examId', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/exams')
      .send(examObj)
      .end((err, res) => {
        examId = res.body.exam._id;
        studentId = res.body.exam.students[0]._id;
        done();
      });
  });

  describe('POST', () => {
    it('should add a student to exam', (done) => {
      chai
        .request(app)
        .post(`/api/v1/exams/students/${examId}`)
        .send(studentObj)
        .end((err, res) => {
          const { message, updatedExam } = res.body;
          const { questions, students } = updatedExam;
          res.should.have.status(201);
          assert.equal(message, 'student added');
          checkExam(updatedExam);
          checkExamQuestions(questions);
          checkExamStudents(students);
          done();
        });
    });

    it('should throw an error if examId is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/exams/students/invalid-id')
        .send(studentObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'invalid examId');
          done();
        });
    });

    it('should throw an error if name is missing', (done) => {
      const requestObject = { studentName: 'Philip' };
      chai
        .request(app)
        .post(`/api/v1/exams/students/${examId}`)
        .send(requestObject)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'name is required');
          done();
        });
    });

    it('should throw an error if name is not a string', (done) => {
      const requestObject = { name: 678 };
      chai
        .request(app)
        .post(`/api/v1/exams/students/${examId}`)
        .send(requestObject)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'name must be a string');
          done();
        });
    });
  });

  describe('PUT', () => {
    it('should throw an error if examId is invalid', (done) => {
      chai
        .request(app)
        .put('/api/v1/exams/students/invalid-id')
        .send(studentObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'invalid examId');
          done();
        });
    });

    it('should throw an error if studentId is invalid', (done) => {
      const requestObject = { studentId: '12345', name: 'John' };
      chai
        .request(app)
        .put(`/api/v1/exams/students/${examId}`)
        .send(requestObject)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'invalid studentId');
          done();
        });
    });

    it('should throw an error if required param is missing', (done) => {
      const requestObject = { studentId, studentName: 'Philip' };
      chai
        .request(app)
        .put(`/api/v1/exams/students/${examId}`)
        .send(requestObject)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'name is required');
          done();
        });
    });

    it('should throw an error if name is not a string', (done) => {
      const requestObject = { studentId, name: 678 };
      chai
        .request(app)
        .put(`/api/v1/exams/students/${examId}`)
        .send(requestObject)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'name must be a string');
          done();
        });
    });
  });
  describe('DELETE', () => {
    it('should delete student successfully', (done) => {
      const requestObject = { studentId };
      chai
        .request(app)
        .delete(`/api/v1/exams/students/${examId}`)
        .send(requestObject)
        .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body.message, 'student deleted');
          done();
        });
    });
    it('should throw an error if examId is invalid', (done) => {
      chai
        .request(app)
        .delete('/api/v1/exams/students/invalid-id')
        .send(studentObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'invalid examId');
          done();
        });
    });

    it('should throw an error if studentId is invalid', (done) => {
      const requestObject = { studentId: '12345', name: 'John' };
      chai
        .request(app)
        .delete(`/api/v1/exams/students/${examId}`)
        .send(requestObject)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'invalid studentId');
          done();
        });
    });
  });

  after((done) => {
    chai
      .request(app)
      .delete(`/api/v1/exams/${examId}`)
      .end(() => {
        done();
      });
  });
});

describe.only('api/v1/exams/students/save-exam-results/:examId', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/exams')
      .send(examObj)
      .end((err, res) => {
        const { exam } = res.body;
        const { _id, questions, students } = exam;
        const questionsIncorrect = questions
          .filter((question, i) => i % 2 === 1)
          .map((question) => question._id);
        const questionsCorrect = questions
          .filter((question, i) => i % 2 !== 1)
          .map((question) => question._id);

        examId = _id;
        studentId = students[0]._id;
        saveExamResultsObj = {
          studentId,
          questionsIncorrect,
          questionsCorrect,
        };
        done();
      });
  });

  describe('PUT', () => {
    it("should save student's exam results", (done) => {
      chai
        .request(app)
        .put(`/api/v1/exams/students/save-exam-results/${examId}`)
        .send(saveExamResultsObj)
        .end((err, res) => {
          res.should.have.status(200);
          assert.equal(res.body.message, 'exam results saved');
          done();
        });
    });

    it('should throw an error if examId is invalid', (done) => {
      chai
        .request(app)
        .put('/api/v1/exams/students/save-exam-results/invalid-id')
        .send(saveExamResultsObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'invalid examId');
          done();
        });
    });

    it('should throw an error if studentId is invalid', (done) => {
      const requestObj = {
        ...saveExamResultsObj,
        studentId: '12345',
      };
      chai
        .request(app)
        .put(`/api/v1/exams/students/save-exam-results/${examId}`)
        .send(requestObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'invalid studentId');
          done();
        });
    });

    it('should throw an error if required param is missing', (done) => {
      const requestObj = {
        ...saveExamResultsObj,
      };
      delete requestObj.questionsCorrect;
      chai
        .request(app)
        .put(`/api/v1/exams/students/save-exam-results/${examId}`)
        .send(requestObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'questionsCorrect is required');
          done();
        });
    });

    it('should throw an error if param is wrong type', (done) => {
      const requestObj = {
        ...saveExamResultsObj,
        questionsIncorrect: { idOne: '123', idTwo: '456' },
      };
      chai
        .request(app)
        .put(`/api/v1/exams/students/save-exam-results/${examId}`)
        .send(requestObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'questionsIncorrect must be an array');
          done();
        });
    });

    it('should throw an error if question ids are invalid', (done) => {
      const requestObj = {
        ...saveExamResultsObj,
        questionsCorrect: ['123', '5db1cc76d7abed421c30bb83'],
      };
      chai
        .request(app)
        .put(`/api/v1/exams/students/save-exam-results/${examId}`)
        .send(requestObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(
            res.body.error,
            'questionsIncorrect must contain the questionIds of the questions that the student got incorrect and questionsCorrect must contain the questionIds of the questions that the student got correct',
          );
          done();
        });
    });
  });

  after((done) => {
    chai
      .request(app)
      .delete(`/api/v1/exams/${examId}`)
      .end(() => {
        done();
      });
  });
});
