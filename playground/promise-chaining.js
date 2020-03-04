require('../src/db/mongoose')
const User = require('../src/models/user')

// 5e5ea5ef08ed5d5fd8e3eb0f

//Promise chaining
// User.findByIdAndUpdate('5e5ea5ef08ed5d5fd8e3eb0f', { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

//Async/Await
const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count 
}

updateAgeAndCount('5e5ea5ef08ed5d5fd8e3eb0f', 2).then((count) => {
    console.log('Count: ', count)
}).catch((e) => {
    console.log(e)
})