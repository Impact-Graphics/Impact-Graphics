'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = (formData.get('email') as string || '').trim()
    const password = formData.get('password') as string || ''

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        const msg = error.message.toLowerCase()
        if (msg.includes('invalid login credentials')) {
            return {
                error: 'Invalid email or password. Please check your credentials or create an account if you are new.',
                email,
            }
        }
        if (msg.includes('email not confirmed')) {
            return {
                error: 'Your email address has not been confirmed yet. Please check your inbox for the confirmation link.',
                email,
            }
        }
        return { error: error.message, email }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = (formData.get('email') as string || '').trim()
    const password = formData.get('password') as string || ''
    const confirmPassword = formData.get('confirmPassword') as string || ''

    if (!email) {
        return { error: 'Email address is required' }
    }
    if (!password) {
        return { error: 'Password is required' }
    }
    if (password !== confirmPassword) {
        return { error: 'Passwords do not match', email }
    }
    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters long', email }
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        const msg = error.message.toLowerCase()
        if (msg.includes('already registered') || msg.includes('user_already_exists') || msg.includes('already exists')) {
            return {
                error: 'An account with this email already exists.',
                accountExists: true,
                email,
            }
        }
        return { error: error.message, email }
    }

    // Supabase security check: if user already exists, identities array is empty []
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        return {
            error: 'An account with this email already exists.',
            accountExists: true,
            email,
        }
    }

    // 1. If signUp returned an active session directly, redirect immediately to /dashboard
    if (data.session) {
        revalidatePath('/', 'layout')
        redirect('/dashboard')
    }

    // 2. If no session returned yet, attempt instant signInWithPassword
    // (This automatically logs the user in if email confirmation is disabled in Supabase!)
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (!signInError) {
        revalidatePath('/', 'layout')
        redirect('/dashboard')
    }

    // 3. If signInWithPassword failed because email confirmation is still enforced by Supabase
    return {
        success: 'Account created! Please check your email to confirm your account, or log in if confirmation is complete.',
        email,
    }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
