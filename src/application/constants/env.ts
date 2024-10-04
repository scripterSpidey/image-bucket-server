const getEnv =(key:string,defaultValue?: string):string  =>{
    const value = process.env[key] || defaultValue;
    if(value == undefined){
        throw new Error(`missing env variable ${key}`)
    }
    return value;
}

export const PORT = getEnv('PORT');
export const CLIENT_URL = getEnv("CLIENT_URL")
export const DATABASE_URL = getEnv("DATABASE_URL")
export const EMAIL_PASSKEY = getEnv('EMAIL_PASSKEY')
export const EMAIL = getEnv("EMAIL");
export const JWT_PRIVATE_KEY = getEnv("JWT_PRIVATE_KEY");
export const JWT_PUBLIC_KEY = getEnv("JWT_PUBLIC_KEY");
export const NODE_ENV = getEnv('NODE_ENV')

export const CLOUDINARY_API_KEY = getEnv("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = getEnv("CLOUDINARY_API_SECRET");
export const CLOUDINARY_CLOUD_NAME = getEnv("CLOUDINARY_CLOUD_NAME");