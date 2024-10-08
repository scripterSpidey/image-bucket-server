export interface UserSchema {
    name:string,
    email:string,
    password:string,
    verified?:boolean,
    otp:number,
    images?:{
        url:string,
        title:string
    }[]
}