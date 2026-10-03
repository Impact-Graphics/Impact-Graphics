import Link from "next/link";
import Image from "next/image";
import { Search, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/login/actions";

export default async function Navbar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-dark/10 bg-light/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <Image
                        src="/logo.jpg"
                        alt="Impact Graphics Logo"
                        width={32}
                        height={32}
                        className="rounded transition-transform group-hover:scale-105 object-cover"
                    />
                    <span className="font-bold text-xl tracking-tight text-dark hidden sm:inline-block">
                        Impact Graphics
                    </span>
                </Link>
                <nav className="flex items-center gap-6">
                    {user ? (
                        <>
                            <Link href="/library" className="flex items-center gap-2 text-sm font-bold bg-dark text-light px-4 py-2 rounded hover:bg-dark/90 transition-colors">
                                <Search className="w-4 h-4" />
                                Explore
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-sm font-semibold text-gray hover:text-dark transition-colors"
                            >
                                Dashboard
                            </Link>
                            <form action={logout}>
                                <button type="submit" className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-700 transition-colors">
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-semibold text-gray hover:text-dark transition-colors"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="text-sm font-bold bg-[#DFFF00] text-[#111111] px-4 py-2 rounded hover:bg-[#cbe600] transition-colors"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
