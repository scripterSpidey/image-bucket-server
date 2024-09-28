export class AppError extends Error{
    public readonly name: string;
    public readonly httpCode: number;
    
    constructor(name:string,httCode:number,message:string){
        super(message);
        this.name = name;
        this.httpCode = httCode;
        
        Error.captureStackTrace(this)
    }
}