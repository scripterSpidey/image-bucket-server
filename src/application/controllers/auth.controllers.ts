
import { LoginUserType, RegisterUserType, VerifyUserType } from "../../interface/auth.interface";
import { UserSchema } from "../../interface/enitities";
import { UserModel } from "../../repository/model/user.model";
import errorCodes, { ErrorNames } from "../constants/error.codes";
import { generateToken } from "../services/jwt";
import { sendOTP } from "../services/mail.service";
import { AppError } from "../utils/app.error";
import bcrypt from "bcryptjs"


export const register = async (data: RegisterUserType)=> {

    const { userName, email, password, confirmPassword } = data;
    console.log(data)
    if (!userName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        throw new AppError(ErrorNames.BAD_REQUEST, errorCodes.BAD_REQUEST, "Please enter all fields")
    }
    if (password !== confirmPassword) {
        throw new AppError(ErrorNames.BAD_REQUEST, errorCodes.BAD_REQUEST, "Passwords do not match")
    }

    if (password.length < 4) {
        throw new AppError(ErrorNames.BAD_REQUEST, errorCodes.BAD_REQUEST, "Password is too short")
    }

    if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))) {
        throw new AppError(ErrorNames.BAD_REQUEST, errorCodes.BAD_REQUEST, "Invalid email format")
    }

    const existingUser = await  UserModel.findOne({email});
    if(existingUser){
        throw new AppError(ErrorNames.DUPLICATE,errorCodes.CONFLICT,"This user already exist")
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const otp = Math.floor(1000 + Math.random() * 9000)

    const newUser: UserSchema = {
        name: userName,
        email: email,
        password: hashedPassword,
        otp
    }

    await new UserModel(newUser).save()

    await sendOTP(email, otp)

    return{
        email,
        message:'veify email'
    }
}

export const verify = async (data:VerifyUserType)=>{
    const {email, otp} = data;

    const user = await UserModel.findOne({email});
    if(!user || String(user.otp) != otp){
        throw new AppError(ErrorNames.UNAUTHERIZED, errorCodes.UNAUTHERIZED,"Invalid credentials")
    }

    await UserModel.findOneAndUpdate(
        {email},
        {verified:true}
    )

    const token  = generateToken({userId:user._id,email:user.email})

    return{
        verified:true,
        email:user.email,
        token 
    }
}    

export const login = async(data:LoginUserType)=>{
    const {email,password} = data;
    if(!email || !password) {
        throw new AppError(ErrorNames.BAD_REQUEST,errorCodes.BAD_REQUEST,"Please provide all datas")
    }

    const user = await UserModel.findOne({email});
    
    if(!user || !(await bcrypt.compare(password,user.password))){
        throw new AppError(ErrorNames.NOT_FOUND,errorCodes.NOT_FOUND,"Invalid credentials")
    }

    const token = generateToken({email:user.email,userId:user._id})

    return {
        token,
        email:user.email,
        userId:user._id
    }
}

