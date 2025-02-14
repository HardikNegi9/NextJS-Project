import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/VerificationMail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'hardiknegi06@gmail.com',
            to: email,
            subject:'Verify Code',
            react: VerificationEmail({username: username, otp: verifyCode}),
        });

        return {success: true, message: "Verification email sent"};
    }catch (emailError) {
        console.error("Error sending verification email", emailError);
        return {success: false, message: "Error sending verification email"};
    }
}
