//NPM modules
const express = require('express')
//Required files
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//Setting up express
const app = express()
const port = process.env.PORT || 3000

//Setting up routers
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

//Starting port
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const bcrypt = require('bcryptjs')

const myFunction = async () => {
    const password = 'Red12345!'
    const hashedPassword = await bcrypt.hash(password, 8)

    console.log(password)
    console.log(hashedPassword)

    const isMatch = await bcrypt.compare('Red12345!', hashedPassword)
    console.log(isMatch)
}

myFunction()