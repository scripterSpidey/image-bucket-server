import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../../interface/auth.interface";
import { verifyToken } from "../../application/services/jwt";
import { AppError } from "../../application/utils/app.error";
import errorCodes, { ErrorNames } from "../../application/constants/error.codes";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
      interface Request {
        user?: UserPayload
      }
    }
  }

export const authenticateUser = (req: Request, res: Response, next: NextFunction)=>{
    try {
        const {_userToken} = req.cookies;
        if(!_userToken){
            throw new AppError(ErrorNames.UNAUTHERIZED,errorCodes.UNAUTHERIZED,"Invalid credentials")
        }
        const payload = verifyToken(_userToken);
        if(!payload){
            throw new AppError(ErrorNames.UNAUTHERIZED,errorCodes.UNAUTHERIZED,"Invalid credentials")
        }
        req.user = payload;
        console.log('user payload: ',payload);
        // throw new AppError(ErrorNames.UNAUTHERIZED,errorCodes.UNAUTHERIZED,"Invalid credentials")
        next()
    } catch (error) {
        next(error)
    }
}