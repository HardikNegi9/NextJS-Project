'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

function page() {
    
    const router = useRouter()
    const params = useParams()
    const {toast} = useToast()

    // zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            identifier: ''
        },
    })


    const onSubmit = async (data : z.infer<typeof verifySchema>) => {
        
        try {
            
            const response =  await axios.post("/api/verify-code", {
                username: params.username,
                code: data.identifier
            })

            toast({
                title: 'Success',
                description: response.data.message,
                duration: 5000,
            })

            router.replace('/sign-in')

        } catch (error) {
            console.error("Error signing up of user", error)
            const axiosError = error as AxiosError<ApiResponse>
            
            let errorMessage = axiosError.response?.data.message ?? "An error occurred"
            
            toast({
                title: 'Sign Up Error',
                description: errorMessage,
                variant: 'destructive'
            })
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mn-6">
                        Verify Account
                    </h1>
                    <p className="mb-4">
                        Please enter the verification code sent to your email.
                    </p>
                </div>
                <div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="identifier"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verfication Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>

                </div>
            </div>
        </div>
    )
}

export default page
