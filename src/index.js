//NPM modules
const express = require('express')
//Required files
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//Setting up express
const app = express()
const port = process.env.PORT || 3000

const multer = require('multer')
const upload = multer({
    dest: 'images'
})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
})

//Setting up routers
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

//Starting port
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

