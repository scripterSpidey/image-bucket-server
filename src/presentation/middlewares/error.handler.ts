import { ErrorRequestHandler } from "express";
import { AppError } from "../../application/utils/app.error";


const errorHandler: ErrorRequestHandler = (error,req,res,next)=>{

    const statusCode = error instanceof AppError ? error.httpCode : 500;
    const message = error instanceof AppError ? error.message : "oops! something went wrong"
    console.log(' error: ',error)
    res.status(statusCode).send(`${message}`);
    next();
}

export default errorHandler; 