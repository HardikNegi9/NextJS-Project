import { NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try{
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier }, // credentials.identifier is the email can be written as credentials.email
                            { username: credentials.identifier } // credentials.identifier is the username
                        ]
                    })

                    if (!user) {
                        throw new Error("No user found");
                    }

                    if (user.isVerified === false) {
                        throw new Error("User is not verified");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user;
                    } else {    
                        throw new Error("Password is incorrect");
                    }
                    
                }catch (error: any){
                    throw new Error("Error in authorize function");
                }
            }
        }),
    ],

    pages: {
        signIn: "/sign-in",
    },

    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }

            return token;
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id?.toString() || "";
                session.user.isVerified = token.isVerified === "true";
                session.user.isAcceptingMessages = token.isAcceptingMessages === "true";
                session.user.username = token.username?.toString();
            }
            return session;
        }
    }

}