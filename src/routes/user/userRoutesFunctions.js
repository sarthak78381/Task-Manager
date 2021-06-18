const User = require('../../models/user');

const createUser = async (req, res) => {
    try {
        const new_User = new User(req.body);
        let token = await new_User.generateAuthToken();
        return res.status(201).send({new_User, token});
    } catch(error) {
        res.status(400);
        res.send(error.message);
    }
}

const getUserData = async (req, res) => {
    res.send(req.user);
}

const getUserAvatar =  async (req, res) => {
    try {
        
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) throw new Error;
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
}

const updateUser = async (req, res) => {
    let allowedUpdates = ["name", "age", "email", "password"];
    let updating = Object.keys(req.body);
    let isUpdateAllowed = updating.every(update => allowedUpdates.includes(update));
    
    if (!isUpdateAllowed) return res.status(400).send('invalid updates!');
    
    try{
        const {user} = req;
        updating.forEach(update => user[update] = req.body[update]);
        await user.save();
        return res.send(user);
    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }
}

const deleteUser = async (req, res) => {
    try{
        await req.user.remove();
        return res.send(req.user)
    } catch (error) {
        res.status(500);
        res.send(error.message);  
    }
}

const logInToUser = async (req, res) => {
    try {
        let user = await User.findByCredentials(req.body.email, req.body.password);
        let token = await user.generateAuthToken();
        return res.send({user, token});
    } catch(error) {
        return res.status(400).send(error.message);
    }
}

const logOutFromUser = async (req, res) => {
    try {
        let {user, token} = req;
        user.tokens = user.tokens.filter(eToken => !eToken === token);
        await user.save();
        res.send();
    } catch(error) {
        return res.status(400).send(error.message);
    }
}

const logOutFromAllUser = async (req, res) => {
    try {
        let {user} = req;
        user.tokens = [];
        await user.save();
        res.send();
    } catch(error) {
        return res.status(400).send(error.message);
    }
}

module.exports = {
    deleteUser,
    updateUser,
    getUserData,
    getUserAvatar,
    createUser,
    logInToUser,
    logOutFromUser,
    logOutFromAllUser
}