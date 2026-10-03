'use client'

import { useState } from 'react'
import { login } from './actions'
import Link from 'next/link'

export default function LoginPage() {
    const [errorMsg, setErrorMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleAction(formData: FormData) {
        setIsLoading(true)
        setErrorMsg('')
        const result = await login(formData)
        // Login redirects on success, if we get here and there's a result, it's an error
        if (result && result.error) {
            setErrorMsg(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-sm p-8 rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
                <h1 className="text-2xl font-bold mb-6 text-center text-[#111111]">Welcome Back</h1>

                <form action={handleAction} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#111111] mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent text-[#111111]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#111111] mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent text-[#111111]"
                        />
                    </div>

                    {errorMsg && (
                        <div className="text-sm text-red-500 font-semibold p-2 bg-red-50 rounded">
                            {errorMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#111111] text-[#F5F5F5] font-bold py-2.5 rounded hover:bg-[#111111]/90 transition-colors disabled:opacity-70 mt-2"
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[#6B7280]">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-[#111111] font-bold hover:underline">
                        Sign up
                    </Link>
                </div>

                <div className="mt-4 text-center text-sm">
                    <Link href="#" className="text-[#6B7280] hover:text-[#111111] transition-colors">
                        Forgot password?
                    </Link>
                </div>
            </div>
        </div>
    )
}
