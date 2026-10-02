import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

export default function Navbar() {
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
                    <Link
                        href="/library"
                        className="text-sm font-semibold text-gray hover:text-dark transition-colors"
                    >
                        Prompt Library
                    </Link>
                    <Link
                        href="/library"
                        className="flex items-center gap-2 text-sm font-bold bg-dark text-light px-4 py-2 rounded hover:bg-dark/90 transition-colors"
                    >
                        <Search className="w-4 h-4" />
                        Explore
                    </Link>
                </nav>
            </div>
        </header>
    );
}
