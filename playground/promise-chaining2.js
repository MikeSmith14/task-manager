require('../src/db/mongoose')
const Task = require('../src/models/Task')


//Promise chaining
// Task.findByIdAndDelete('5e5ea9db4794d743945d00fd').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

//Async/Await
const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false})
}

deleteTaskAndCount('5e5e80db568c7044ec0d5fa9').then((count) => {
    console.log('Count: ', count)
}).catch((e) => {
    console.log(e)
})