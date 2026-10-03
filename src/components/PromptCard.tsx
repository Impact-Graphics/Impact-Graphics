import Link from "next/link";
import { Prompt } from "@/types/prompt";
import FavoriteButton from "@/components/FavoriteButton";

interface PromptCardProps {
    prompt: Prompt;
    isFavorited?: boolean;
    userId?: string | null;
}

export default function PromptCard({ prompt, isFavorited = false, userId = null }: PromptCardProps) {
    const isPremium = prompt.access === "Premium";

    return (
        <div className="relative group h-full">
            {/* Favorite button — outside Link so clicks don't navigate */}
            <div className="absolute top-3 right-3 z-10">
                <FavoriteButton
                    promptId={prompt.id}
                    userId={userId}
                    initialFavorited={isFavorited}
                />
            </div>

            <Link href={`/library/${prompt.slug}`} className="block h-full">
                <div className="bg-white border-2 border-dark rounded-xl p-6 h-full flex flex-col shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] group-hover:-translate-y-1 transition-all">
                    <div className="flex items-start justify-between mb-4 gap-2 pr-8">
                        <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-light border border-gray-200 text-gray-custom">
                            {prompt.category}
                        </span>
                        {isPremium ? (
                            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-dark text-volt shrink-0">
                                Premium
                            </span>
                        ) : (
                            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-volt text-dark shrink-0">
                                Free
                            </span>
                        )}
                    </div>

                    <h3 className="text-xl font-black text-dark mb-2 leading-tight group-hover:text-volt transition-colors">
                        {prompt.title}
                    </h3>

                    <p className="text-sm text-gray-500 font-medium flex-grow mb-4">
                        {prompt.description}
                    </p>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400">
                            {prompt.ai_tool}
                        </span>
                        <span className="text-xs font-black text-dark group-hover:text-volt inline-flex items-center gap-1 transition-colors">
                            View Details <span aria-hidden="true">&rarr;</span>
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
