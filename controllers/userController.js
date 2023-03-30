import validator from "validator"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET, { expiresIn: '3d' })
}

//signup method
const signup = async(email, password, username) =>{
    if (!email || !password || !username) {
      throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
      throw Error('Email not valid')
    }

    if (!validator.isStrongPassword(password)) {
      throw Error('Password not strong enough')
    }

  
    const exists = await db('users').where({ email }).first()
  
    if (exists) {
      throw Error('Email already in use')
    }
  
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
  
    const [user] = await db('users').insert({ email, password: hash, username })

    console.log(user);
    return user
  }


  //signup controller
  export const signupUser = async(req, res) => {
    try {
        const {email, password, username} = req.body.user
        const user = await signup(email, password, username)
        console.log(user);
        // create a token
        const token = createToken(user)
        res.status(200).json({user:{email, token, username}})
    } catch (err) {
      res.status(400).json({error: err.message})
    }
}
