const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const examRoutes = require('./routes/exams/routes');
const userRoutes = require('./routes/users/routes');

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

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
