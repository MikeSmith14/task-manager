//NPM modules
const express = require('express')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
//Required files
const User = require('../models/user')
const auth = require('../middleware/auth')

//Configuring Multer
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) { 
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

//Create users
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()    
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//User login
router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

//User logout
router.post('/users/logout', auth, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})
//User logout of all sessions
router.post('/users/logoutall', auth, async(req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

//Find all users
router.get('/users/me',  auth, async(req,res) => {
    res.send(req.user)
})

//Update a specific user
router.patch('/users/me', auth, async (req,res) => {
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate) {
        return res.status(400).send({error: 'Invalid updates'})
    }
    try{
        //Need to do this way instead of findByIdAndUpdate to allow for 
        //middleware to actually be executed to hash the password if needed
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Delete a specific user
router.delete('/users/me', auth, async (req, res) => {
    try{
        await req.user.remove()
        res.send(req.user)
    } catch(e) {
        res.status(500).send()
    }
})

//Upload a profile picture
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) =>{
    //User sharp to resize, convert and store images
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//Delete existing profile picture
router.delete('/users/me/avatar', auth, async (req, res) => {
   req.user.avatar = undefined
   await req.user.save()
   res.send()
})

//Serving up the picture
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})


module.exports = router
