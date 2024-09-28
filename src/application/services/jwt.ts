import jwt from "jsonwebtoken"

import { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } from "../constants/env";
import { UserPayload } from "../../interface/auth.interface";


export function generateToken(payload: object, expiresIn?: string | number | undefined): string {
    const options: jwt.SignOptions = { algorithm: 'RS256' }
    if (expiresIn) options.expiresIn = expiresIn;
    return jwt.sign(
        payload,
        JWT_PRIVATE_KEY,
        options
    )
}

export function verifyToken(token: string):UserPayload|false {
    try {
        const decoded = jwt.verify(token, JWT_PUBLIC_KEY) as UserPayload;
        return decoded
    } catch (error){
        console.log('jwt error: ',error)
        return false
    }
}