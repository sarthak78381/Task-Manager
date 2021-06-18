const express = require('express');
const auth = require('../../middlewares/auth');
const { deleteUserTask, updateUserTask, getUserTask, postUserTask } = require('./taskRoutesFunction');

const router = express.Router();

router.post('/tasks', auth, postUserTask)

router.get('/tasks', auth, getUserTask)

router.get('/tasks/:id', auth, getUserTask)

router.patch('/tasks/:id', auth, updateUserTask)

router.delete('/tasks/:id', auth, deleteUserTask)


module.exports = router;