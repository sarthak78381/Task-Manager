const Task = require('../../models/task');
const User = require('../../models/user');

const postUserTask = async (req, res) => {
    try {
        const new_task = new Task({
            ...req.body,
            owner: req.user._id
        });
        await new_task.save()
        res.send(new_task)
    } catch(error) {
        res.status(400);
        res.send(error.message);
    }
}

const getUserTask = async (req, res) => {
    let task;
    let {id: _id} = req.params;
    try{
        if (_id) {
            task = await Task.findOne({_id, owner: req.user._id});
            if (!task) return res.status(404).send();
        } else {
            let match = {}
            let sort = {}
            if (req.query.completed) {
                match.completed = req.query.completed === 'true';
            }
            if (req.query.sortBy) {
                let parts = req.query.sortBy.split(':');
                sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
            }
            await req.user.populate({
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            }).execPopulate();
        }
        res.send(req.user.tasks)
    } catch(error) {
        res.status(500);
        res.send(error.message);
    }
}

const updateUserTask = async (req, res) => {
    let {id: _id} = req.params;
    let allowedUpdates = ["completed", "description"];
    let updating = Object.keys(req.body);
    let isUpdateAllowed = updating.every(update => allowedUpdates.includes(update));
    
    if (!isUpdateAllowed) return res.status(400).send('invalid updates!');
    
    try{
        const task = await Task.findOneAndUpdate({_id, owner: req.user._id}, req.body, {new: true, runValidators: true});
        if (!task) return res.status(404).send();
        return res.send(task)
    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }
}

const deleteUserTask = async (req, res) => {
    let {id: _id} = req.params;
    try{
        const task = await Task.findOneAndDelete({_id, owner: req.user._id});
        if (!task) return res.status(404).send();
        return res.send(task)
    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }
}

module.exports = {
    deleteUserTask,
    updateUserTask,
    getUserTask,
    postUserTask
}