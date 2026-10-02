import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-full bg-dark text-light py-12 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo.jpg"
                        alt="Impact Graphics Logo"
                        width={24}
                        height={24}
                        className="rounded object-cover"
                    />
                    <span className="font-bold text-lg">Impact Graphics</span>
                </div>

                <p className="text-gray-400 text-sm font-medium">
                    Impact Graphics — Where Creativity Meets AI.
                </p>

                <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                    <Link href="/" className="hover:text-volt transition-colors">Home</Link>
                    <Link href="/library" className="hover:text-volt transition-colors">Library</Link>
                </div>
            </div>
        </footer>
    );
}
