export type RegisterUserType = {
    userName: string,
    email:string,
    password: string,
    confirmPassword: string
}

export type VerifyUserType = {
    email:string,
    otp:string
}

export type LoginUserType ={
    email:string,
    password:string
}

export type UserPayload ={
    userId:string,
    email:string
}