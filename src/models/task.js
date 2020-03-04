//NPM Modules
const mongoose = require('mongoose')

//Creating Task Model
const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    }, 
        completed: {
            type: Boolean,
            default: false
    }
})

module.exports = Task