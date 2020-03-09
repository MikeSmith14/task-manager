//NPM modules
const express = require('express')
const router = new express.Router()
//Required files
const Task = require('../models/task')
const auth = require('../middleware/auth')


//Create task
router.post('/tasks',  auth, async (req, res) => {
    const task = new Task({
        ...req.body, 
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch (e){
        res.status(400).send(e)
    }
})

//Find all tasks
router.get('/tasks', auth, async (req,res) => {
    try{
        await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)
    } catch(e){
        res.status(500).send()
    }
})

//Find specific task
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({ _id, owner: req.user._id })
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch (e){
           res.status(500).send()
    }
})

//Update a specific task
router.patch('/tasks/:id', auth, async (req,res) => {
    const allowedUpdates = ['description','completed']
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate) {
        return res.status(400).send({error: 'Invalid updates'})
    }
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch (e) {
        res.status(400).send(e)
    }
})

//Delete a specific task
router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router