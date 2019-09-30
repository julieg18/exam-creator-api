const express = require('express');

const examRoutes = require('./routes/exams/routes');
const userRoutes = require('./routes/users/routes');

const app = express();

app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/users', userRoutes);

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
