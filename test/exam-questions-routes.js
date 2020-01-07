import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import {
  examObj,
  questionObj,
  checkExam,
  checkExamQuestions,
  checkExamStudents,
} from '../test-helper';

chai.use(chaiHttp);
chai.should();

let examId = '';
let questionId = '';

describe('/api/v1/exams/questions/:examId', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/exams')
      .send(examObj)
      .end((err, res) => {
        const { exam } = res.body;
        examId = exam._id;
        done();
      });
  });

  describe('POST', () => {
    it('should add a question to the exam', (done) => {
      chai
        .request(app)
        .post(`/api/v1/exams/questions/${examId}`)
        .send(questionObj)
        .end((err, res) => {
          const { message, updatedExam } = res.body;
          const { questions, students } = updatedExam;
          questionId = questions[questions.length - 1]._id;

          res.should.have.status(201);
          assert.equal(message, 'question added to exam');
          checkExam(updatedExam);
          checkExamQuestions(questions);
          checkExamStudents(students);
          done();
        });
    });

    it('should throw an error if examId is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/exams/questions/invalid-id')
        .send(questionObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'invalid examId');
          done();
        });
    });

    it('should throw an error if required param is missing', (done) => {
      const requestObj = { ...questionObj };
      delete requestObj.name;
      chai
        .request(app)
        .post(`/api/v1/exams/questions/${examId}`)
        .send(requestObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'name is required');
          done();
        });
    });

    it('should throw an error if param is wrong type', (done) => {
      const requestObj = {
        ...questionObj,
        options: { optionOne: '4', optionsTwo: '3' },
      };
      chai
        .request(app)
        .post(`/api/v1/exams/questions/${examId}`)
        .send(requestObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'options must be an array');
          done();
        });
    });

    it('should throw an error if question is written incorrectly', (done) => {
      const requestObj = {
        ...questionObj,
        answer: ['789'],
      };
      chai
        .request(app)
        .post(`/api/v1/exams/questions/${examId}`)
        .send(requestObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(
            res.body.error,
            'for a question with a radio type: the options answer property must contain one optionId',
          );
          done();
        });
    });
  });

  describe('PUT', () => {
    it('should edit a question', (done) => {
      const requestObj = {
        questionId,
        options: [
          { name: '-5', optionId: '127' },
          { name: '2', optionId: '128' },
          { name: '5', optionId: '129' },
        ],
      };
      chai
        .request(app)
        .put(`/api/v1/exams/questions/${examId}`)
        .send(requestObj)
        .end((err, res) => {
          const { message, updatedExam } = res.body;
          const { questions, students } = updatedExam;

          res.should.have.status(200);
          assert.equal(message, 'question edited');
          checkExam(updatedExam);
          checkExamQuestions(questions);
          checkExamStudents(students);
          done();
        });
    });

    it('should throw an error if examId is invalid', (done) => {
      const requestObj = {
        questionId,
        options: ['-3', '5', '3'],
      };
      chai
        .request(app)
        .put('/api/v1/exams/questions/invalid-id')
        .send(requestObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'invalid examId');
          done();
        });
    });

    it('should throw an error if questionId is invalid', (done) => {
      const requestObj = {
        questionId: 'invalid-id',
        options: ['-3', '5', '3'],
      };
      chai
        .request(app)
        .put(`/api/v1/exams/questions/${examId}`)
        .send(requestObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'invalid questionId');
          done();
        });
    });

    it('should throw an error if required param is missing', (done) => {
      const requestObj = { questionId };
      chai
        .request(app)
        .put(`/api/v1/exams/questions/${examId}`)
        .send(requestObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(
            res.body.error,
            'questionId and at least one param(type, options, name, or answer) to be changed is required',
          );
          done();
        });
    });

    it('should throw an error if param is wrong type', (done) => {
      const requestObj = {
        questionId,
        name: { name: 'What is 5 - 2?' },
      };
      chai
        .request(app)
        .put(`/api/v1/exams/questions/${examId}`)
        .send(requestObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'name must be a string');
          done();
        });
    });

    it('should throw an error if question is written incorrectly', (done) => {
      const requestObj = {
        questionId,
        answer: ['3'],
      };
      chai
        .request(app)
        .put(`/api/v1/exams/questions/${examId}`)
        .send(requestObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(
            res.body.error,
            'for a question with a radio type: the options answer property must contain one optionId',
          );
          done();
        });
    });
  });

  describe('DELETE', () => {
    it('should delete question', (done) => {
      const requestObj = {
        questionId,
      };
      chai
        .request(app)
        .put(`/api/v1/exams/questions/${examId}`)
        .send(requestObj)
        .end((err, res) => {
          done();
        });
    });

    it('should throw an error if examId is invalid', (done) => {
      const requestObj = {
        questionId,
      };
      chai
        .request(app)
        .delete('/api/v1/exams/questions/invalid-id')
        .send(requestObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'invalid examId');
          done();
        });
    });

    it('should throw an error if questionId is invalid', (done) => {
      const requestObj = {
        questionId: 'invalid-id',
      };
      chai
        .request(app)
        .put(`/api/v1/exams/questions/${examId}`)
        .send(requestObj)
        .end((err, res) => {
          res.should.have.status(400);
          assert.equal(res.body.error, 'invalid questionId');
          done();
        });
    });
  });

  after((done) => {
    chai
      .request(app)
      .delete(`/api/v1/exams/${examId}`)
      .end((err, res) => {
        done();
      });
  });
});
