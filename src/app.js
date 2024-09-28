// app.use(middleware())
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

//cors- who can access the server
const app = express()
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

// types of data handling 
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extented: true, limit:"16kb"}))
app.use(express.static("public"))

// reading and sending the other cookies
app.use(cookieParser())

export {app}