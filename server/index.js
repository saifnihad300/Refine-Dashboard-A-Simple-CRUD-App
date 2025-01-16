import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import connectdb from './mongodb/connect.js'
import userRouter from './routes/user.routes.js'
import propertyRouter from './routes/property.routes.js'


dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({limit: '50mb'}));

app.get('/', (req, res) =>{
    res.send({message: "Hello world!"});
})
// middleware
app.use('/api/v1/users', userRouter)
app.use('/api/v1/properties', propertyRouter)

const startServer = async ()=>{
    try{
        connectdb(process.env.MONGODB_URL)
        app.listen(8080, ()=>{console.log('server started successfully at port 8080')})
    }catch{
        console.log("error");
    }
}

startServer();