//NPM modules
const express = require('express')
//Required files
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//Setting up express
const app = express()
const port = process.env.PORT || 3000

//Middleware
// app.use((req, res, next) => {
//     if(req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

//Maintenance middleware
// app.use((req, res, next) => {
//     res.status(503).send('Website is down for maintenance')
//     next()
// })

//Setting up routers
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

//Starting port
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

