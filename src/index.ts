import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import morgan from 'morgan';
import cookieParser from "cookie-parser";
dotenv.config()
import { PORT } from "./application/constants/env";
import { CLIENT_URL } from "./application/constants/env";

import { connectToDB } from "./application/config/mongoDB";
import userRouter from "./presentation/routes/user.routes";
import errorHandler from "./presentation/middlewares/error.handler";


const startServer = async () => {

    await connectToDB();

    const app = express();
    
    app.use(
        cors({
            origin: CLIENT_URL,
            credentials: true
        })
    )
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));
   
    app.use(morgan('dev'));
    app.use(cookieParser());

    app.get('/', (req, res) => {
        console.log('body: ',req.body)
        res.send('You are all set')
    })

    app.use('/',(req,res,next)=>{
        console.log(req.headers);
        next()
    })
    app.use('/user',userRouter)

    app.use(errorHandler)

    app.listen(PORT, () => {
        console.log(`server running on port: ${PORT}`)
    })
}

startServer();
