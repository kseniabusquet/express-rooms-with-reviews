import { Router } from 'express'
import { json } from 'mocha/lib/reporters/index.js'
import Room from '../models/Room.model.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import attachCurrentUser from '../middlewares/attachCurrentUser.js';
import fileUpload from '../config/cloudinary.config.js'


const roomRouter = Router()

roomRouter.get('/rooms', async (req, res) => {
    try {
        const rooms = await Room.find({})
        return res.status(200).json(rooms)
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

roomRouter.get('/rooms/:id', async (req, res) => {
    try {
        const {id} = req.params
        const roomFound = await Room.findOne({_id: id}).populate('reviews')
        return res.status(200).json(roomFound)
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

roomRouter.post('/rooms', isAuthenticated, attachCurrentUser, async (req, res) => {
    try {
        const room = {
            userId: req.currentUser._id,
            ...req.body
        }
        const newRoom = await Room.create(room)
        return res.status(201).json(newRoom)
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

roomRouter.put('/rooms/:id', isAuthenticated, attachCurrentUser, async (req, res) => {
    try {
        const {id} = req.params
        const room = await Room.findOne({_id: id})

        if(room.userId.toString() !== req.currentUser._id.toString()){
            return res.status(401).json({error: "You are not authorized to edit this room"})
        }

        const roomData = req.body
        const updatedRoom = await Room.findByIdAndUpdate(id, roomData, {new:true})
        return res.status(200).json(updatedRoom)
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

roomRouter.delete('/rooms/:id', isAuthenticated, attachCurrentUser, async (req, res) => {
    try {
        const {id} = req.params
        const room = await Room.findOne({_id: id})

        if(room.userId.toString() !== req.currentUser._id.toString()){
            return res.status(401).json({error: "You are not authorized to edit this room"})
        }

        await Room.findByIdAndDelete(id)
        return res.status(204).json()
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

roomRouter.post('/rooms/upload', fileUpload.single('imageUrl'), isAuthenticated, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(422).json({error: 'You must upload a file'})
        }
        return res.status(200).json({filePath: req.file.path})
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({error: 'Internal Server Error'})
    }
})


export default roomRouter;