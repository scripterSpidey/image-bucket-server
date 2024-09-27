const getEnv =(key:string,defaultValue?: string):string  =>{
    const value = process.env[key] || defaultValue;
    if(value == undefined){
        throw new Error(`missing env variable ${key}`)
    }
    return value;
}

export const PORT = getEnv('PORT');
export const CLIENT_URL = getEnv("CLIENT_URL")