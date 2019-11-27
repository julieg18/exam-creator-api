import bcrypt from 'bcryptjs';
import User from '../../models/User';
import Exam from '../../models/Exam';

const { SESS_NAME } = process.env;

async function signUpUser(req, res) {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userObj = {
    username,
    email,
    password: hashedPassword,
  };
  try {
    const newUser = await new User(userObj).save();
    req.session.user = { userId: newUser._id };
    res.status(201);
    res.json({ message: 'User added.', newUser });
  } catch (err) {
    res.status(501);
    res.json({ error: 'Could not add user.' });
  }
}

async function getUser(req, res) {
  const {
    session: {
      user: { userId },
    },
  } = req;
  const user = await User.findById(userId);
  res.json({ message: 'User found.', user });
}

async function deleteUser(req, res) {
  const { session } = req;
  const {
    user: { userId },
  } = session;
  try {
    await User.findByIdAndRemove(userId, { useFindAndModify: false });
    await Exam.deleteMany({ creator: userId });
    session.destroy(() => {
      res.clearCookie(SESS_NAME);
      res.status(200);
      res.json({ message: 'User deleted.', userId });
    });
  } catch (err) {
    res.status(501);
    res.json({ error: 'Could not delete user.' });
  }
}

function logoutUser(req, res) {
  const { session } = req;
  const {
    user: { userId },
  } = session;
  session.destroy((err) => {
    if (err) {
      res.status(500);
      res.json({ error: 'Something went wrong.' });
    } else {
      res.clearCookie(SESS_NAME);
      res.status(200);
      res.json({ message: 'User logged out.', userId });
    }
  });
}

async function loginUser(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    req.session.user = { userId: user._id };
    res.status(200);
    res.json({ message: 'User logged in.', user });
  } catch (err) {
    res.status(501);
    res.json({ error: 'Could not login user.' });
  }
}

async function getUserExams(req, res) {
  const {
    session: {
      user: { userId },
    },
  } = req;
  try {
    const exams = await Exam.find({ creator: userId });
    res.status(200);
    res.json({ message: 'Exams found.', exams });
  } catch (err) {
    res.status(501);
    res.json({ error: 'Could not get exams.' });
  }
}

export { signUpUser, getUser, deleteUser, logoutUser, loginUser, getUserExams };
