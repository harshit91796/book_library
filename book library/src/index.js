const express = require('express')
const app = express()
const router = require('../src/routes/routes');
const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config()

app.use(express.json())

mongoose.connect(process.env.URI).then(()=>{
    console.log('database is connected')
}).catch(
    err => console.log(err)
)



app.use('/',router)

app.listen(process.env.PORT,(req,res)=>{
    console.log('server is on')
})
