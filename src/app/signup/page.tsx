'use client'

import { useState, useEffect, Suspense } from 'react'
import { signup } from '@/app/login/actions'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'

function SignupForm() {
    const searchParams = useSearchParams()
    const initialEmail = searchParams.get('email') || ''

    const [email, setEmail] = useState(initialEmail)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [accountExists, setAccountExists] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (initialEmail) {
            setEmail(initialEmail)
        }
    }, [initialEmail])

    async function handleAction(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setErrorMsg('')
        setSuccessMsg('')
        setAccountExists(false)

        const formData = new FormData(e.currentTarget)
        const result = await signup(formData)

        if (result) {
            if (result.email) setEmail(result.email)

            if (result.accountExists) {
                setAccountExists(true)
                setErrorMsg('An account with this email address already exists.')
            } else if (result.error) {
                setErrorMsg(result.error)
            } else if (result.success) {
                setSuccessMsg(result.success)
            }
        }
        setIsLoading(false)
    }

    return (
        <div className="w-full max-w-md p-8 rounded-2xl bg-white border-2 border-[#111111] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
            {/* Header Tabs */}
            <div className="flex border-2 border-[#111111] rounded-xl overflow-hidden mb-8 p-1 bg-[#F5F5F5]">
                <Link
                    href={`/login${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                    className="flex-1 py-2.5 text-center font-bold text-sm text-[#6B7280] hover:text-[#111111] transition-colors flex items-center justify-center gap-2"
                >
                    <LogIn className="w-4 h-4" />
                    Log In
                </Link>
                <Link
                    href={`/signup${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                    className="flex-1 py-2.5 text-center font-black text-sm rounded-lg bg-[#111111] text-[#DFFF00] shadow-sm flex items-center justify-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                </Link>
            </div>

            <h1 className="text-3xl font-black mb-2 text-[#111111]">Create Account</h1>
            <p className="text-sm font-medium text-[#6B7280] mb-6">
                Join Impact Graphics AI Prompt Vault to save your favorite prompts.
            </p>

            {/* Account already exists banner with 1-click Log In button */}
            {accountExists ? (
                <div className="mb-6 p-5 rounded-2xl bg-[#DFFF00]/25 border-2 border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                    <div className="flex items-start gap-3 mb-3">
                        <AlertCircle className="w-5 h-5 text-[#111111] shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-black text-[#111111] text-base">Account Already Exists</h3>
                            <p className="text-xs font-semibold text-[#111111]/80 mt-1">
                                An account is already registered with <span className="font-mono underline">{email}</span>.
                            </p>
                        </div>
                    </div>
                    <Link
                        href={`/login?email=${encodeURIComponent(email)}`}
                        className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#111111] text-[#DFFF00] font-black rounded-xl border-2 border-[#111111] hover:bg-[#111111]/90 transition-all text-sm"
                    >
                        <span>Log In with this Account</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : null}

            {successMsg ? (
                <div className="p-6 rounded-2xl bg-green-50 border-2 border-green-500 text-green-900 mb-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-black text-base text-green-950">Success!</h3>
                            <p className="text-sm font-medium text-green-800 mt-1">{successMsg}</p>
                        </div>
                    </div>
                    <Link
                        href={`/login?email=${encodeURIComponent(email)}&registered=true`}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#111111] text-[#DFFF00] font-black rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] hover:shadow-[5px_5px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-0.5 transition-all text-sm"
                    >
                        <span>Proceed to Log In</span>
                        <LogIn className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
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
                        <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="At least 6 characters"
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

                    <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1.5">
                            Confirm Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            placeholder="Re-enter password"
                            className="w-full px-4 py-3 border-2 border-[#111111] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DFFF00] text-[#111111] font-medium placeholder:text-gray-400"
                        />
                    </div>

                    {errorMsg && !accountExists && (
                        <div className="text-sm font-semibold p-4 bg-red-50 border-2 border-red-200 text-red-800 rounded-xl flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#DFFF00] text-[#111111] font-black py-3.5 rounded-xl border-2 border-[#111111] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-0.5 transition-all disabled:opacity-70 mt-2 text-base flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <span>Creating Account...</span>
                        ) : (
                            <>
                                <span>Create Account</span>
                                <UserPlus className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>
            )}

            <div className="mt-8 text-center text-sm font-medium text-[#6B7280] pt-6 border-t border-gray-100">
                Already have an account?{' '}
                <Link
                    href={`/login${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                    className="text-[#111111] font-black underline hover:text-[#6B7280] transition-colors"
                >
                    Log In
                </Link>
            </div>
        </div>
    )
}

export default function SignupPage() {
    return (
        <div className="flex-grow flex items-center justify-center p-4 py-12 bg-[#F5F5F5]">
            <Suspense fallback={
                <div className="w-full max-w-md p-8 rounded-2xl bg-white border-2 border-[#111111] text-center font-bold">
                    Loading...
                </div>
            }>
                <SignupForm />
            </Suspense>
        </div>
    )
}
