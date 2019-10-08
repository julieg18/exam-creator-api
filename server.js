import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import examRoutes from './routes/exams/routes';
import userRoutes from './routes/users/routes';

const app = express();

dotenv.config();

const uri = process.env.DB;
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

app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/users', userRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
