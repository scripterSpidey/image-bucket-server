
import { LoginUserType, RegisterUserType, UserPayload, VerifyUserType } from "../../interface/auth.interface";
import { UserSchema } from "../../interface/enitities";
import { UserModel } from "../../repository/model/user.model";
import cloudinary from "../config/cloudinary";
import errorCodes, { ErrorNames } from "../constants/error.codes";
import { generateToken } from "../services/jwt";
import { sendOTP } from "../services/mail.service";
import { AppError } from "../utils/app.error";
import bcrypt from "bcryptjs"


export const register = async (data: RegisterUserType) => {

    const { userName, email, password, confirmPassword } = data;
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

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        throw new AppError(ErrorNames.DUPLICATE, errorCodes.CONFLICT, "This user already exist")
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

    return {
        email,
        message: 'veify email'
    }
}

export const verify = async (data: VerifyUserType) => {
    const { email, otp } = data;

    const user = await UserModel.findOne({ email });
    if (!user || String(user.otp) != otp) {
        throw new AppError(ErrorNames.UNAUTHERIZED, errorCodes.UNAUTHERIZED, "Invalid credentials")
    }

    await UserModel.findOneAndUpdate(
        { email },
        { verified: true }
    )

    const token = generateToken({ userId: user._id, email: user.email })

    return {
        verified: true,
        email: user.email,
        token
    }
}

export const login = async (data: LoginUserType) => {
    const { email, password } = data;
    if (!email || !password) {
        throw new AppError(ErrorNames.BAD_REQUEST, errorCodes.BAD_REQUEST, "Please provide all datas")
    }

    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError(ErrorNames.UNAUTHERIZED, errorCodes.NOT_FOUND, "Invalid credentials")
    }

    const token = generateToken({ email: user.email, userId: user._id })

    return {
        token,
        email: user.email,
        userId: user._id
    }
}

export const sendOTPforForgotPassword = async (data: { email: string }) => {
    const { email } = data;

    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new AppError(ErrorNames.NOT_FOUND, errorCodes.NOT_FOUND, "This account is not registered with us")
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    await UserModel.findByIdAndUpdate(
        user._id,
        { $set: { otp: otp } }
    )
    await sendOTP(email, otp)

    return { message: 'otp send' }
}

export const verifyOTPforForgotPasword = async (data: { otp: string, email: string }) => {
    const { otp, email } = data;
    console.log(data)
    const user = await UserModel.findOne({ email });
    console.log(user)
    if (!user || String(user.otp) !== otp) {
        throw new AppError(ErrorNames.INVALID_DATA, errorCodes.FORBIDDEN, "Wrong OTP")
    }

    return {
        message: "OTP verification successfull",
        email
    }

}

export const resetPassword = async (data: { email: string, newPassword: string }) => {
    const { email, newPassword } = data;
    if (!newPassword || newPassword.length < 4) {
        throw new AppError(ErrorNames.BAD_REQUEST, errorCodes.BAD_REQUEST, "Invalid password")
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await UserModel.updateOne(
        { email },
        { password: hashedPassword }
    );

    return {
        message: "password updated"
    }
}


export const uploadImages = async (files: Express.Multer.File[], title: string[], user: UserPayload) => {
    console.log(user)
    if (!files) {
        throw new AppError(ErrorNames.BAD_REQUEST, errorCodes.BAD_REQUEST, "Please upload atleas one image")
    }
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    console.log(files)
    files.forEach(file => {
        if (!(validImageTypes.includes(file.mimetype))) {
            throw new AppError(ErrorNames.INVALID_DATA, errorCodes.BAD_REQUEST, "Only images are allowed to upload")
        }
    });



    const results = {
        successful: [] as { originalName: string, url: string, public_id: string }[],
        failed: [] as { file: string }[]
    };

    const uploadPromises = files.map(async (file, index) => {
        try {
            const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(
                base64String,
                {
                    public_id: `${Date.now()}-${title[index] || file.originalname}`,
                    resource_type: 'auto'
                }
            );

            results.successful.push({
                originalName: title[index] || file.originalname,
                url: result.secure_url,
                public_id: result.public_id.trim()
            });
        } catch (error) {
            console.log(error)
            results.failed.push({
                file: file.originalname
            });
        }
    });

    await Promise.all(uploadPromises);
    console.log(results)
    const imageData = results.successful.map((item: { url: string, originalName: string, public_id: string }) => ({
        url: item.url,
        title: item.originalName
    }))
    await UserModel.findByIdAndUpdate(
        user.userId,
        { $addToSet: { images: imageData } },
        { upsert: true }
    )
}

export const getImages = async (user: UserPayload) => {
    if (!user) {
        throw new AppError(ErrorNames.UNAUTHERIZED, errorCodes.UNAUTHERIZED, "Invalid credentials")
    }

    const images = await UserModel.findById(user.userId).select("images")
    if (!images) {
        throw new AppError(ErrorNames.NOT_FOUND, errorCodes.NOT_FOUND, "Unable to find the data")
    }
    return images.images;
}

export const editImages = async (user: UserPayload, imageId: string, data: { imageTitle: string }) => {
    if (!user) {
        throw new AppError(ErrorNames.UNAUTHERIZED, errorCodes.UNAUTHERIZED, "Invalid credentials")
    }

    if (!imageId || !data.imageTitle) {
        throw new AppError(ErrorNames.BAD_REQUEST, errorCodes.BAD_REQUEST, "Please provide all details")
    }

    const edited = await UserModel.findOneAndUpdate(
        { _id: user.userId, "images._id": imageId },
        { $set: { "images.$.title": data.imageTitle.trim() } },
        { new: true }
    )
    return edited?.images;
}

export const deleteImages = async (user: UserPayload, imageId: string) => {
    if (!user) {
        throw new AppError(ErrorNames.UNAUTHERIZED, errorCodes.UNAUTHERIZED, "Invalid credentials")
    }

    const deleteImage = await UserModel.findByIdAndUpdate(
        user.userId,
        { $pull: { images: { _id: imageId } } },
        { new: true }
    )

    return deleteImage?.images;
}