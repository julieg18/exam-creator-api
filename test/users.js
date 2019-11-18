import chai, { assert } from 'chai';
import request from 'superagent';
import clonedeep from 'lodash.clonedeep';
import {
  examObj,
  userSignupObj,
  secondUserSignupObj,
  userLoginObj,
  checkUser,
} from '../test-helper';

const { SESS_NAME } = process.env;
const server = request.agent();
const apiAddress = 'http://localhost:8080/api/v1';

chai.should();

describe('/api/v1/users', () => {
  describe('GET /', () => {
    before(async () => {
      const signupRes = await server
        .post(`${apiAddress}/users/signup`)
        .send(userSignupObj);
      signupRes.should.have.status(201);
    });

    it('should get a information about a user', async () => {
      const getUserRes = await server.get(`${apiAddress}/users`);
      const {
        body: { message, user },
      } = getUserRes;
      getUserRes.should.have.status(200);
      assert.equal(message, 'user found');
      checkUser(user, userSignupObj);
      assert.containsAllKeys(user, ['createdAt', 'updatedAt']);
    });

    it('should throw an error if user is not logged in', async () => {
      const logoutRes = await server.post(`${apiAddress}/users/logout`);
      logoutRes.should.have.status(200);

      await server.get(`${apiAddress}/users`).catch((err) => {
        const { response } = err;
        const {
          body: { error },
        } = response;
        response.should.have.status(401);
        assert.equal(error, 'user is not logged in');
      });
    });

    after(async () => {
      const loginRes = await server
        .post(`${apiAddress}/users/login`)
        .send(userLoginObj);
      loginRes.should.have.status(200);

      const deleteRes = await server.delete(`${apiAddress}/users`);
      deleteRes.should.have.status(200);
    });
  });

  describe('DELETE /', () => {
    before(async () => {
      const signupRes = await server
        .post(`${apiAddress}/users/signup`)
        .send(userSignupObj);
      signupRes.should.have.status(201);
    });

    it('should throw an error if user is not logged in', async () => {
      const logoutRes = await server.post(`${apiAddress}/users/logout`);
      logoutRes.should.have.status(200);

      await server.delete(`${apiAddress}/users`).catch((err) => {
        const { response } = err;
        const {
          body: { error },
        } = response;
        response.should.have.status(401);
        assert.equal(error, 'user is not logged in');
      });

      const loginRes = await server
        .post(`${apiAddress}/users/login`)
        .send(userLoginObj);
      loginRes.should.have.status(200);
    });

    it('should delete a user', async () => {
      const deleteRes = await server.delete(`${apiAddress}/users`);
      deleteRes.should.have.status(200);
    });
  });

  describe('POST /signup', () => {
    it('should signup a user', async () => {
      const res = await server
        .post(`${apiAddress}/users/signup`)
        .send(userSignupObj);
      const { message, newUser } = res.body;

      res.should.have.status(201);
      assert.equal(message, 'user added');
      checkUser(newUser, userSignupObj);
      res.should.have.cookie(SESS_NAME);
    });

    it('should throw an error if a user is already logged in', async () => {
      await server
        .post(`${apiAddress}/users/signup`)
        .send(userSignupObj)
        .catch((err) => {
          const { response } = err;
          const {
            body: { error },
          } = response;
          response.should.have.status(400);
          assert.equal(error, 'a user is already logged in');
        });

      const logoutRes = await server.post(`${apiAddress}/users/logout`);
      logoutRes.should.have.status(200);
    });

    it('should throw an error if a required param is missing', async () => {
      const missingParamObj = { ...secondUserSignupObj };
      delete missingParamObj.username;
      await server
        .post(`${apiAddress}/users/signup`)
        .send(missingParamObj)
        .catch((err) => {
          const { response } = err;
          const {
            body: { error },
          } = response;
          response.should.have.status(400);
          assert.equal(error, 'username is required');
          response.should.not.have.cookie(SESS_NAME);
        });
    });

    it('should throw an error if a param is a wrong type', async () => {
      const wrongTypeParamObj = {
        ...secondUserSignupObj,
        username: { name: 'James' },
      };
      await server
        .post(`${apiAddress}/users/signup`)
        .send(wrongTypeParamObj)
        .catch((err) => {
          const { response } = err;
          const {
            body: { error },
          } = response;
          response.should.have.status(400);
          assert.equal(error, 'username must be a string');
          response.should.not.have.cookie(SESS_NAME);
        });
    });

    it('should throw an error if a param is empty', async () => {
      const emptyParamObj = {
        ...secondUserSignupObj,
        email: '',
      };
      await server
        .post(`${apiAddress}/users/signup`)
        .send(emptyParamObj)
        .catch((err) => {
          const { response } = err;
          const {
            body: { error },
          } = response;
          response.should.have.status(400);
          assert.equal(error, 'email must not be empty');
          response.should.not.have.cookie(SESS_NAME);
        });
    });

    it('should throw an error if email already exists', async () => {
      const invalidEmailObj = {
        ...secondUserSignupObj,
        email: userSignupObj.email,
      };
      await server
        .post(`${apiAddress}/users/signup`)
        .send(invalidEmailObj)
        .catch((err) => {
          const { response } = err;
          const {
            body: { error },
          } = response;
          response.should.have.status(400);
          assert.equal(error, 'email already exists');
          response.should.not.have.cookie(SESS_NAME);
        });
    });

    it('should throw an error if username is invalid', async () => {
      const invalidUsernameObj = {
        ...secondUserSignupObj,
        username: '      ',
      };
      await server
        .post(`${apiAddress}/users/signup`)
        .send(invalidUsernameObj)
        .catch((err) => {
          const { response } = err;
          const {
            body: { error },
          } = response;
          response.should.have.status(400);
          assert.equal(error, 'username must not contain only whitespace');
          response.should.not.have.cookie(SESS_NAME);
        });
    });

    it('should throw an error if email is invalid', async () => {
      const invalidEmailObj = {
        ...secondUserSignupObj,
        email: 'jamesgmail.com',
      };
      await server
        .post(`${apiAddress}/users/signup`)
        .send(invalidEmailObj)
        .catch((err) => {
          const { response } = err;
          const {
            body: { error },
          } = response;
          response.should.have.status(400);
          assert.equal(error, 'invalid email');
          response.should.not.have.cookie(SESS_NAME);
        });
    });

    it('should throw an error is password is invalid', async () => {
      const invalidPasswordObj = { ...secondUserSignupObj, password: 'j' };
      await server
        .post(`${apiAddress}/users/signup`)
        .send(invalidPasswordObj)
        .catch((err) => {
          const { response } = err;
          const {
            body: { error },
          } = response;
          response.should.have.status(400);
          assert.equal(error, 'password length must be at least 8 characters');
          response.should.not.have.cookie(SESS_NAME);
        });
    });

    after(async () => {
      await server.post(`${apiAddress}/users/login`).send(userLoginObj);
      const deleteRes = await server.delete(`${apiAddress}/users`);
      deleteRes.should.have.status(200);
    });
  });

  describe('POST /login', () => {
    before(async () => {
      await server.post(`${apiAddress}/users/signup`).send(userSignupObj);
      const logoutRes = await server.post(`${apiAddress}/users/logout`);
      logoutRes.should.have.status(200);
    });

    it('should login a user', async () => {
      const loginRes = await server
        .post(`${apiAddress}/users/login`)
        .send(userLoginObj);
      const { message, user } = loginRes.body;
      loginRes.should.have.status(200);
      assert.equal(message, 'user logged in');
      checkUser(user, userSignupObj);
      loginRes.should.have.cookie(SESS_NAME);
      const logoutRes = await server.post(`${apiAddress}/users/logout`);
      logoutRes.should.have.status(200);
    });

    it('should throw an error if required param is empty', async () => {
      const missingParamObj = { ...userLoginObj };
      delete missingParamObj.email;
      await server
        .post(`${apiAddress}/users/login`)
        .send(missingParamObj)
        .catch((err) => {
          const { response } = err;
          const {
            body: { error },
          } = response;
          response.should.have.status(400);
          assert.equal(error, 'email is required');
          response.should.not.have.cookie(SESS_NAME);
        });
    });

    it('should throw an error if email is not in database', async () => {
      const incorrectEmailObj = {
        ...userLoginObj,
        email: 'nathan@gmail.com',
      };
      await server
        .post(`${apiAddress}/users/login`)
        .send(incorrectEmailObj)
        .catch((err) => {
          const { response } = err;
          const {
            body: { error },
          } = response;
          response.should.have.status(400);
          assert.equal(error, 'email not found in database');
          response.should.not.have.cookie(SESS_NAME);
        });
    });

    it('should throw an error if password is incorrect', async () => {
      const incorrectPasswordObj = {
        ...userLoginObj,
        password: 'nathisisfantastic',
      };
      await server
        .post(`${apiAddress}/users/login`)
        .send(incorrectPasswordObj)
        .catch((err) => {
          const { response } = err;
          const {
            body: { error },
          } = response;
          response.should.have.status(400);
          assert.equal(error, 'password is incorrect');
          response.should.not.have.cookie(SESS_NAME);
        });
    });

    after(async () => {
      await server.post(`${apiAddress}/users/login`).send(userLoginObj);
      const deleteRes = await server.delete(`${apiAddress}/users`);
      deleteRes.should.have.status(200);
    });
  });

  describe('POST /logout', () => {
    before(async () => {
      const signupRes = await server
        .post(`${apiAddress}/users/signup`)
        .send(userSignupObj);
      signupRes.should.have.status(201);
    });

    it('should logout a user', async () => {
      const logoutRes = await server.post(`${apiAddress}/users/logout`);
      logoutRes.should.have.status(200);
    });

    it('should throw an error if user is not logged in', async () => {
      await server.post(`${apiAddress}/users/logout`).catch((err) => {
        const { response } = err;
        const {
          body: { error },
        } = response;
        response.should.have.status(401);
        assert.equal(error, 'user is not logged in');
        response.should.not.have.cookie(SESS_NAME);
      });
    });

    after(async () => {
      await server.post(`${apiAddress}/users/login`).send(userLoginObj);
      const deleteRes = await server.delete(`${apiAddress}/users`);
      deleteRes.should.have.status(200);
    });
  });

  describe('GET /exams', () => {
    before(async () => {
      const newExamObj = clonedeep(examObj);
      const signupRes = await server
        .post(`${apiAddress}/users/signup`)
        .send(userSignupObj);
      signupRes.should.have.status(201);

      newExamObj.creator = signupRes.body.newUser._id;
      const createExamRes = await server
        .post(`${apiAddress}/exams`)
        .send(newExamObj);
      createExamRes.should.have.status(201);
    });

    it('should retrieve the users exams', async () => {
      const getExamsRes = await server.get(`${apiAddress}/users/exams`);
      getExamsRes.should.have.status(200);
    });

    it('should throw an error if a user is not logged in', async () => {
      const logoutRes = await server.post(`${apiAddress}/users/logout`);
      logoutRes.should.have.status(200);

      await server.get(`${apiAddress}/users/exams`).catch((err) => {
        const { response } = err;
        const {
          body: { error },
        } = response;
        response.should.have.status(401);
        assert.equal(error, 'user is not logged in');
      });

      const loginRes = await server
        .post(`${apiAddress}/users/login`)
        .send(userLoginObj);
      loginRes.should.have.status(200);
    });

    after(async () => {
      const deleteRes = await server.delete(`${apiAddress}/users`);
      deleteRes.should.have.status(200);
    });
  });
});
