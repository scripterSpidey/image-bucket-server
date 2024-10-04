import { Response, Request, NextFunction } from "express";
import { LoginUserType, RegisterUserType, UserPayload, VerifyUserType } from "../../interface/auth.interface";
import { deleteImages, editImages, getImages, login, register, resetPassword, sendOTPforForgotPassword, uploadImages, verify, verifyOTPforForgotPasword } from "../../application/controllers/auth.controllers";
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
        const body = req.body as VerifyUserType;

        const response = await verify(body);

        res.cookie('_userToken', response.token, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            secure: NODE_ENV === 'production',
            // sameSite:'none'
        })


        res.status(200).send({
            verified: true,
            email: response.email
        });

    } catch (error) {
        next(error)
    }
}

export const onLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body as LoginUserType;

        const response = await login(body);

        res.cookie('_userToken', response.token, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            secure: NODE_ENV === 'production',
            // sameSite:'none'
        })

        res.status(200).send({
            email: response.email,
            userId: response.userId
        })
    } catch (error) {
        next(error)
    }
}

export const onLogout = async (req: Request, res: Response) => {

    res.cookie('_userToken', '', {
        maxAge: 0,
        httpOnly: true,
        secure: NODE_ENV === 'production',
        // sameSite:'none'
    })
    res.status(200).send({ message: 'logged out successfully' })
}

export const onForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const response = await sendOTPforForgotPassword(body);
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

export const onVerifyOTPforForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body as { email: string, otp: string };

        const response = await verifyOTPforForgotPasword(body);
        res.status(200).json(response)

    } catch (error) {
        next(error)
    }
}

export const onResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body as { newPassword: string, email: string };
        const response = await resetPassword(body);
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

export const onUploadImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const files = req.files! as unknown as Express.Multer.File[];
        const { title } = req.body;
        const response = await uploadImages(files, title, user!);
        res.status(201).json(response)
    } catch (error) {
        next(error)
    }
}

export const onGetImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const response = await getImages(user!);
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}


export const onDeleteImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const imageId = req.query.imageId as string;
        const user = req.user;
        const response = await deleteImages(user!, imageId);
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }


}


export const onEditImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as UserPayload;
        const imageId = req.query.imageId as string;
        const body = req.body as { imageTitle: string }
        const response = await editImages(user, imageId, body);
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}


export const onAuth = async (req: Request, res: Response) => {
    res.status(200).send(req.user)
}
