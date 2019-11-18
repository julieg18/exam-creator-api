import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import connectStore from 'connect-mongo';
import examRoutes from './routes/exams/routes';
import userRoutes from './routes/users/routes';

dotenv.config();

const {
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,
  DB,
  PORT,
  NODE_ENV,
} = process.env;

const app = express();

app.use(helmet());

const uri = DB;
mongoose
  .connect(uri, {
    dbName: 'exam-creator',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => {
    console.log(err);
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
      secure: NODE_ENV === 'production',
      maxAge: parseInt(SESS_LIFETIME, 10),
    },
  }),
);

app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/users', userRoutes);

const port = PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
