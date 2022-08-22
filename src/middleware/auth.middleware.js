const HttpException = require('../utils/HttpExeception.utils');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const auth = (...roles) => {
    return async function(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const bearer = 'Bearer ';

            if(!authHeader || !authHeader.startsWith(bearer)) throw new HttpException(401, 'Access denied. No credentials provided!');

            const token = authHeader.replace(bearer, '');
            const secretKey = process.env.SECRET_JWT || "";

            //verify token
            const decoded = jwt.verify(token, secretKey);
            const user = await userModel.findOne({ id: decoded.user_id });

            if(!user) throw new HttpException(401, 'Authentication failed!');

            // Check if the current user own the token
            const ownerAuthorization = req.params.id == user.id;

            /**
             * EITHER
             * if the current user don't own the token
             * if the user don't have permission to this action
             * the user will get this error message
             *  */
            if(!ownerAuthorization && roles.length && !roles.includes(user.role)) throw new HttpException(401, 'Unauthorized.');

            // if the user has the permission 
            req.currentUser = user;
            next();

        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}
module.exports = auth;