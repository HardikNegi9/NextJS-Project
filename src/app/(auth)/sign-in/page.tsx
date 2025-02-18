'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { set } from "mongoose"


const page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { toast } = useToast()
    const router = useRouter()

    // zod implementation
    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifer: '',
            password: '',
            isAcceptingMessage: false
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        // using next auth
        const result = await signIn('credentials', {
          redirect: false,
          identifier: data.identifer,
          password: data.password,
        })

        if (result?.error) {
          toast({
            title: 'Login Failed',
            description: result.error,
            variant: 'destructive',
          })
        }
        if (result?.url){
          router.replace('/dashboard')
        }
        setIsSubmitting(false)
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome Back, O ka e ri
                    </h1>
                    <p className="mb-4">Sign In to get started</p>
                </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="identifer"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email/username" {...field}/>
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
                                    : ("Sign In")
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