import express from 'express'
import { createComment, getAllComments } from '../controllers/commentController.js'
import auth from '../middlewares/auth.js'

const router = express.Router()

//add a comment
router.post('/:slug/comments', auth,  createComment)


//get all comments without auth
router.get('/:slug/comments',  getAllComments)


export default router