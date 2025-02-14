import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})


export async function GET(request: Request) {
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url) // usl = /api/unique-username?username=<abc>
        const queryParam = {
            username: searchParams.get("username")
        }

        // Validate the query parameter using the zod schema
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log("Result", result) // check the result in the console

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: "Invalid username",
                errors: usernameError
            }, {status: 400})
        }

        const {username} = result.data

        const existingUser = await UserModel.findOne({ username, isVerified: true })

        if(existingUser){
            return Response.json({
                success: false,
                message: "Username already exists"
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: "Username is available"
        })



    } catch (error) {
        console.error("Error checking Username", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {status: 500})
    }
}