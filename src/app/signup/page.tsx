'use client'

import { useState } from 'react'
import { signup } from '@/app/login/actions'
import Link from 'next/link'

export default function SignupPage() {
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleAction(formData: FormData) {
        setIsLoading(true)
        setErrorMsg('')
        setSuccessMsg('')
        const result = await signup(formData)
        if (result) {
            if (result.error) setErrorMsg(result.error)
            if (result.success) setSuccessMsg(result.success)
        }
        setIsLoading(false)
    }

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-sm p-8 rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
                <h1 className="text-2xl font-bold mb-6 text-center text-[#111111]">Create Account</h1>

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
                            minLength={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent text-[#111111]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#111111] mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            minLength={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent text-[#111111]"
                        />
                    </div>

                    {errorMsg && (
                        <div className="text-sm text-red-500 font-semibold p-2 bg-red-50 rounded">
                            {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div className="text-sm text-green-700 font-semibold p-3 bg-green-50 rounded border border-green-200">
                            {successMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#DFFF00] text-[#111111] font-bold py-2.5 rounded hover:bg-[#cbe600] transition-colors disabled:opacity-70 mt-2"
                    >
                        {isLoading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[#6B7280]">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#111111] font-bold hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    )
}
