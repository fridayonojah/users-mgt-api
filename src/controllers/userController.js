const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const HttpException = require('../utils/HttpExeception.utils');
const dotenv = require('dotenv');
const { find } = require('../models/user.model');
dotenv.config();


/**
 * This is the controller mainly for handling logic
 *  concerning user
 */

class UserController {
    getAllUsers = async(req, res, next) => {
        let userList = await userModel.find();
        if(!userList.length) throw new HttpException(404, 'Users not found!');

        //send data from the userlist
        userList = userList.map(user => {
            const { password, ...infoWithoutPassword } = user;
            return infoWithoutPassword;
        });
        
        res.send(userList);
    };

    getUserById = async(req, res, next) => {
        const user = await userModel.findOne({ id: req.params.id });
        if(!user) throw new HttpException(404, 'User not found');

        const { password, ...infoWithoutPassword} = user;

        res.send(infoWithoutPassword);
    };

    getUserByUsername = async (req, res, next) => {
        const user = await userModel.findOne({ username: req.params.username });
        if(!user) throw new HttpException(404, 'User not Found');

        const { password, infoWithoutPassword} = user;
        res.send(infoWithoutPassword);
    };

    getCurrentUser = async(req, res, next) =>{
        const { password, ...infoWithoutPassword } = req.currentUser;

        res.send(infoWithoutPassword);
    }

    createUser = async(req, res, next) => {
        const { error } = this.checkValidation(req.body);
        if(error) return res.status(404).send(error.details[0].message);

        let user = await userModel.findOne({ email:req.body.email });
        if(user) return res.status(400).send("Email is already registered with a user!");

        await this.hashPassord(req);

        const result = await userModel.create(req.body);
        
        const msg = !result ? "Internal server error" : "User created successfully";

        res.send({ msg });
        // if(result){
        //     res.status(201).send('User was created!');
        // } 
        // throw new HttpException(500, 'Opps something went wrong.');  
    };


    updateUser = async(req, res, next) => {

        const { error } = this.checkValidation(req.body);
        if(error) return res.status(404).send(error.details[0].message);

        // const user = await userModel.findOne({ email: req.body.email });
        // if(user) return res.status(400).send("Email is aldredy registered with a user");

        await this.hashPassord(req);

        const { password, ...restOfUpdate} = req.body;

        //execute the update query and get the result
        const result = await userModel.update(restOfUpdate, req.params.id);
        if(!result) throw new HttpException(404, 'Opps something went wrong!');

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'User not found' : 
            affectedRows && changedRows ? 'User updated successfully' : 'Error while trying to update.';
        
        res.send({ message, info });
    };

    deleteUser = async(req, res, next) => {
        const result = await userModel.delete(req.params.id);
        const msg = !result ? "Internal server error" : "User has been deleted";
        // if(!result) throw new HttpException(404, 'User not found!');

        // res.send('User has been deleted');
        res.send({ msg });
    };

    userLogin = async (req, res, next) => {
        const { error } = this.checkValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const { email, password: pass} = req.body;

        const user = await userModel.findOne({ email });

        if(!user) throw new HttpException(401, 'Unable to login');

        const isMatch = await bcrypt.compare(pass, user.password);
        if(!isMatch) throw new HttpException(401, 'Incorrect password!');

        //when there is a matched user
        const secretKey = process.env.SECRET_JWT || "";
        const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
            expiresIn: '24h'
        });

        const { password, ...infoWithoutPassword } = user;

        res.send({ ...infoWithoutPassword, token });
    };

    checkValidation = (req) => {
        const schema = Joi.object({
            username: Joi.string().min(5).max(50).required(),
            password: Joi.string().min(5).max(50).required(),
            firstname: Joi.string().max(50).required(),
            lastname: Joi.string().max(50).required(),
            email: Joi.string().min(5).max(50).required(),
            role: Joi.string().min(5).max(50),
            age: Joi.number().required(),
        });
        const result = schema.validate(req);
        return result;
    }
    
    //has password if it exist
    hashPassord = async (req) => {
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
}


module.exports = new UserController;
