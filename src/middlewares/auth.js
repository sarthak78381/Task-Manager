const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        let token = req.header('Authorization').replace("Bearer ", '');
        const isVerified = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({_id: isVerified._id, "tokens.token": token});
        if (!user) throw new Error();
        req.token = token;
        req.user = user;
        next();
    } catch(error) {
        res.status(401).send({error: "fails to authenticate"});
    }
}

module.exports = auth;