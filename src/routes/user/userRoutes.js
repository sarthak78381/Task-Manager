const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const auth = require('../../middlewares/auth');
const { deleteUser, updateUser, getUserData, getUserAvatar, createUser, logInToUser, logOutFromUser, logOutFromAllUser } = require('./userRoutesFunctions');

const router = express.Router();

const uploads = multer({
    limits: {
        fileSize: 1000000
    }, 
    fileFilter(req, file, cb) {
        if (!file.originalname.match('\.(jpeg)$')) return cb(new Error('invalid file type'))
        return cb(undefined, true)
    }
})

router.post('/users', createUser);

router.post('/users/me/avatar', auth, uploads.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).png().resize({width: 250, height: 250}).toBuffer();
    req.user.avatar = buffer;
    await req.user.save()
    res.send(req.user);
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})


router.post('/users/login', logInToUser) 

router.post('/users/logout', auth, logOutFromUser) 

router.post('/users/logout/all', auth, logOutFromAllUser) 

router.get('/users/me', auth, getUserData)

router.get('/users/:id/avatar', getUserAvatar)

router.patch('/users/me', auth, updateUser)

router.delete('/users/me', auth, deleteUser)

router.delete('/users/me/avatar', auth, uploads.single('avatar'), async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send(req.user);
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})


module.exports = router;