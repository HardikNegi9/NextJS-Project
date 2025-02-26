import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { messageSchema } from "@/schemas/messageSchema";
import UserModel from "@/models/User";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username, email, password} = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        
        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username already exists"
            },{status: 400})
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Email already exists with this email"
                },{status: 400})

            }else{
                const hasedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hasedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + (15 * 60)) // 15 minutes
                await existingUserByEmail.save()

            }


        }else{
            const hasedPassword = await bcrypt.hash(password, 10)
            const CodeExpiry = new Date()
            CodeExpiry.setMinutes(CodeExpiry.getMinutes() + 5)

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: CodeExpiry,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User registered successfully, verification email sent"
        }, {status: 200})
            

    } catch (error) {
        console.log('Error registering user', error);
        return Response.json({
            success: false,
            message: "Error registering user"
        },{
            status: 500
        })
    }
}