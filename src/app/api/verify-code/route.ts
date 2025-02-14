import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username, code} =  await request.json();

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if(!user){
            return Response.json({
                success: false,
                message: "User not Found, Invalid username"
            }, {status: 400})
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();

        if(isCodeExpired && isCodeValid){
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "Account verified successfully" 
            },{status: 200})
        }else if(isCodeExpired){
            return Response.json({
                success: false,
                message: "Verification code expired, please signup again"
            }, {status: 400})
        }else{
            return Response.json({
                success: false,
                message: "Invalid verification code"
            }, {status: 400})
        }

    }
    catch (error) {
        console.error("Error checking verify code", error);
        return Response.json({
            success: false,
            message: "Error checking verify code"
        }, {status: 500})
    }
}
