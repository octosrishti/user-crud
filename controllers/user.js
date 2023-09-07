const { User } = require('../models/user')
const bcrypt = require('bcrypt')
const { generateAccessToken } = require('../services/token_service')

const create_user = async (req, res) => {
    try {
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const email = req.body.email
        const username = req.body.username
        const password =req.body.password

        const hash = bcrypt.hash(password, process.env.SALT)
        const user = await User.create({firstName: firstName, lastName: lastName, email: email, username:username, password:hash})

        return res.status(200).json({message:"created new user successfully", user:user});
    } catch (error) {
        return res.status(400).json({error: "unable to create user"});
    }
}

const login_user = async (req, res) => {
    try {
        const username = req.body.username
        const password =req.body.password
        const user = await User.findOne({usename:username})

        if(!user){
            return next(createError.NotFound("User with given credential is not registered"))
        }

        const valid = await bcrypt.compare(password, user.password)

        if(!valid){
            return next(createError.BadRequest("Invalid password"))
        }

        const token = generateAccessToken(user)


        return res.status(200).json({message:"created new user successfully", user:user, token:token});
    } catch (error) {
        return next(createError.InternalServerError("Cannot register User : " + error.message))
    }
}

const get_all_user = async (req, res) => {
    try {
        const allUser = await User.findAll()

        return res.status(200).json({message:"created new user successfully", allUser: allUser});
    } catch (error) {
        return next(createError.InternalServerError("Cannot register User : " + error.message))
    }
}

const get_single_user = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findByPK(id)

        return res.status(200).json({message:"created new user successfully", user:user});
    } catch (error) {
        return next(createError.InternalServerError("Cannot register User : " + error.message))
    }
}

const update_user = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.update(req.body,{
            where:{
                id:id
            }
        })
        return res.status(200).json({message:"created new user successfully", user:user});
    } catch (error) {
        return next(createError.InternalServerError("Cannot register User : " + error.message))
    }
}

const delete_user = async (req, res) => {
    try {
        const id = req.params.id
        await User.destroy({
            where:{
                id:id
            }
        })
        return res.status(200).json({message:"created new user successfully"});
    } catch (error) {
        return next(createError.InternalServerError("Cannot register User : " + error.message))
    }
}

module.exports = {create_user, get_all_user, get_single_user, update_user, delete_user, login_user}