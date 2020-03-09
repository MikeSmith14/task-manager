//NPM Modules
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

//Creating the Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password can not contain the word password')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//Virtual property for user tasks
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//Middleware - Pre function to hash the password before storing
userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//Middleware - Delete User tasks when user is removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

//Checking email and password for login
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user) {
        throw new Error('Unable to login. Please check email and/or password')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login. Please check email and/or password')
    }
    return user
}

//Authenticating Web Tokens
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//Strips data from user for public view
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

//Creating User model
const User = mongoose.model('User', userSchema)

module.exports = User