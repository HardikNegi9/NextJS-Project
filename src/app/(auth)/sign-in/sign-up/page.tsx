'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
// import * as z  from "zod"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


const page = () => {

    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounded = useDebounceCallback(setUsername, 300)
    const { toast } = useToast()
    const router = useRouter()

    // zod implementation
    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            isAcceptingMessage: false
        }
    })

    useEffect(() => {
        const checkUsername = async () => {
            if(username){
                setIsCheckingUsername(true)
                setUsernameMessage('')

                try {
                    const response = await axios.get(`/api/check-username?username=${username}`)
                    setUsernameMessage(response.data.message)

                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "An error occurred")

                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }

        checkUsername()
    }
    , [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)

        try {
            console.log('data ==>', data)
            
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            toast({
                title: 'Success',
                description: response.data.message,
            })
            router.replace('/verify/${username}')

        } catch (error) {
            console.error("Error signing up of user", error)
            const axiosError = error as AxiosError<ApiResponse>
            
            let errorMessage = axiosError.response?.data.message ?? "An error occurred"
            
            toast({
                title: 'Sign Up Error',
                description: errorMessage,
                variant: 'destructive'
            })            

        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Hello, Ko n ni chi wa
                    </h1>
                    <p className="mb-4">Sign Up to get started</p>
                </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="username"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field} onChange={(e) => {
                                            field.onChange(e)
                                            debounded(e.target.value)
                                        }}
                                        />
                                    </FormControl>
                                        {isCheckingUsername && <Loader2 className="animate-spin" />} 
                                        <p className={'text-sm ${usernameMessage === "Username is available"} ? "text-green-500" : "text-red-500"}'}>
                                            {usernameMessage}
                                        </p>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting}
                            className="w-full">
                                {
                                    isSubmitting ?
                                    <>  
                                        <Loader2 /> Please wait...
                                    </>
                                    : ("Sign Up")
                                }
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center">
                        <p>
                            Already have an account?
                            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 ml-1">
                                Sign In
                            </Link>
                        </p>
                    </div>

            </div>
        </div>
    )
}

export default page
