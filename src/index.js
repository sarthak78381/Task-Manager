const express = require('express');
require('./mongodb/mongodb');
const userRouter = require('../src/routes/user/userRoutes')
const taskRouter = require('../src/routes/task/taskRoutes')

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT;


app.listen(port, () => {
    console.log('server is running on port:' + port)
})

