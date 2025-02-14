import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request:Request){
    await dbConnect()

    const {username, content} =  await request.json()

    try {
        const user = await UserModel.findOne({username: username})
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 401})
        }

        // is user accepting messages
        if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "The following User is not accepting messages currently"
            }, {status : 401})
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)

        await user.save()

        return Response.json({
            success: true,
            messages: "Message sent successfully"
        }, { status : 200})


    } catch (error) {
        console.error("Error sending message", error)
        return Response.json({
            success: false,
            message: "Error sending message"
        }, { status: 500 })
    }
}