'use client'

import { useState, useEffect, Suspense } from 'react'
import { login } from './actions'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle } from 'lucide-react'

function LoginForm() {
    const searchParams = useSearchParams()
    const initialEmail = searchParams.get('email') || ''
    const registered = searchParams.get('registered') === 'true'

    const [email, setEmail] = useState(initialEmail)
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isAccountExistsError, setIsAccountExistsError] = useState(false)

    useEffect(() => {
        if (initialEmail) {
            setEmail(initialEmail)
        }
    }, [initialEmail])

    async function handleAction(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setErrorMsg('')
        setIsAccountExistsError(false)

        const formData = new FormData(e.currentTarget)
        const result = await login(formData)

        if (result && result.error) {
            setErrorMsg(result.error)
            if (result.email) setEmail(result.email)
            if (result.error.toLowerCase().includes('create an account')) {
                setIsAccountExistsError(true)
            }
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md p-8 rounded-2xl bg-white border-2 border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
            {/* Header Tabs */}
            <div className="flex border-2 border-[#111111] rounded-xl overflow-hidden mb-8 p-1 bg-[#F5F5F5]">
                <Link
                    href={`/login${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                    className="flex-1 py-2.5 text-center font-black text-sm rounded-lg bg-[#111111] text-[#DFFF00] shadow-sm flex items-center justify-center gap-2"
                >
                    <LogIn className="w-4 h-4" />
                    Log In
                </Link>
                <Link
                    href={`/signup${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                    className="flex-1 py-2.5 text-center font-bold text-sm text-[#6B7280] hover:text-[#111111] transition-colors flex items-center justify-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                </Link>
            </div>

            <h1 className="text-3xl font-black mb-2 text-[#111111]">Welcome Back</h1>
            <p className="text-sm font-medium text-[#6B7280] mb-6">
                Log in to access your saved prompt favorites and dashboard.
            </p>

            {registered && (
                <div className="mb-6 p-4 rounded-xl bg-[#DFFF00]/20 border-2 border-[#111111] text-[#111111] text-sm font-bold flex items-center gap-3">
                    <span className="text-lg">🎉</span>
                    <span>Account created successfully! Please log in below.</span>
                </div>
            )}

            <form onSubmit={handleAction} className="flex flex-col gap-5">
                <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1.5">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border-2 border-[#111111] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFFF00] text-[#111111] font-medium placeholder:text-gray-400"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-black uppercase tracking-wider text-[#111111]">
                            Password
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border-2 border-[#111111] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFFF00] text-[#111111] font-medium pr-12 placeholder:text-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#111111] p-1"
                            title={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {errorMsg && (
                    <div className="text-sm font-semibold p-4 bg-red-50 border-2 border-red-200 text-red-800 rounded-xl flex flex-col gap-2">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <span>{errorMsg}</span>
                        </div>
                        {isAccountExistsError && (
                            <Link
                                href={`/signup?email=${encodeURIComponent(email)}`}
                                className="mt-1 text-xs font-black text-[#111111] underline hover:text-[#6B7280] self-start"
                            >
                                Need an account? Sign up here →
                            </Link>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#111111] text-[#DFFF00] font-black py-3.5 rounded-xl border-2 border-[#111111] shadow-[4px_4px_0px_0px_rgba(223,255,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(223,255,0,1)] hover:-translate-y-0.5 transition-all disabled:opacity-70 mt-2 text-base flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <span>Logging in...</span>
                    ) : (
                        <>
                            <span>Log In</span>
                            <LogIn className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-[#6B7280] pt-6 border-t border-gray-100">
                Don&apos;t have an account yet?{' '}
                <Link
                    href={`/signup${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                    className="text-[#111111] font-black underline hover:text-[#6B7280] transition-colors"
                >
                    Create Account
                </Link>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="flex-grow flex items-center justify-center p-4 py-12 bg-[#F5F5F5]">
            <Suspense fallback={
                <div className="w-full max-w-md p-8 rounded-2xl bg-white border-2 border-[#111111] text-center font-bold">
                    Loading...
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    )
}
