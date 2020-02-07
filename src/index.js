import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import connectStore from 'connect-mongo';
import path from 'path';
import examRoutes from './routes/exams/routes';
import questionRoutes from './routes/exams/questions/routes';
import studentRoutes from './routes/exams/students/routes';
import userRoutes from './routes/users/routes';

dotenv.config();

const { SESS_NAME, SESS_SECRET, SESS_LIFETIME, DB, NODE_ENV } = process.env;

const app = express();

app.use(helmet());

const uri = DB;
mongoose.connect(uri, {
  dbName: 'exam-creator',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

const MongoStore = connectStore(session);
app.use(
  session({
    name: SESS_NAME,
    secret: SESS_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: parseInt(SESS_LIFETIME, 10) / 1000,
    }),
    cookie: {
      sameSite: true,
      httpOnly: true,
      secure: NODE_ENV === 'production',
      maxAge: parseInt(SESS_LIFETIME, 10),
    },
  }),
);

app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/exams/questions', questionRoutes);
app.use('/api/v1/exams/students', studentRoutes);
app.use('/api/v1/users', userRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

export default app;
