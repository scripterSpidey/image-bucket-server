import { Response, Request, NextFunction } from "express";
import { LoginUserType, RegisterUserType, VerifyUserType } from "../../interface/auth.interface";
import { login, register, verify } from "../../application/controllers/auth.controllers";
import { NODE_ENV } from "../../application/constants/env";


export const onRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body as RegisterUserType;
       
        const response = await register(body);
        res.status(201).send(response)
    } catch (error) {
        next(error)
    }
}


export const onVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body as  VerifyUserType;

        const response = await verify(body);

        res.cookie('_userToken',response.token,{
            maxAge:1000*60*60,
            httpOnly:true,
            secure:NODE_ENV === 'production',
            // sameSite:'none'
        })
       

        res.status(200).send({
            verified:true,
            email:response.email
        });

    } catch (error) {
        next(error)
    }
}

export const onLogin = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const body = req.body as LoginUserType;
        
        const response = await login(body);

        res.cookie('_userToken',response.token,{
            maxAge:1000*60*60,
            httpOnly:true,
            secure:NODE_ENV === 'production',
            // sameSite:'none'
        })

        res.status(200).send({
            email:response.email,
            userId:response.userId
        })
    } catch (error) {
        next(error)
    }
}

export const onLogout = async(req: Request, res: Response)=>{

    res.cookie('_userToken','',{
        maxAge:0,
        httpOnly:true,
        secure:NODE_ENV === 'production',
        // sameSite:'none'
    })
    res.status(200).send({message:'logged out successfully'})
}

export const onAuth = async(req: Request, res: Response)=>{
    res.status(200).send(req.user)
}
