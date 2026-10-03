"use client";

import { useState } from "react";
import PromptCard from "@/components/PromptCard";
import { Prompt } from "@/types/prompt";
import clsx from "clsx";

interface LibraryClientProps {
    prompts: Prompt[];
    categories: string[];
    userId: string | null;
    favoritedIds: string[];
}

export default function LibraryClient({ prompts, categories, userId, favoritedIds }: LibraryClientProps) {
    const [activeCategory, setActiveCategory] = useState("All");
    const favSet = new Set(favoritedIds);

    const filteredPrompts =
        activeCategory === "All"
            ? prompts
            : prompts.filter((p) => p.category === activeCategory);

    return (
        <div className="bg-light text-dark py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-12 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">Prompt Library</h1>
                    <p className="text-lg text-gray-500 font-medium">
                        Explore carefully crafted AI prompts ready for your next project.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-10 pb-6 border-b border-gray-200">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={clsx(
                                "px-4 py-2 rounded-full font-bold text-sm transition-all border-2",
                                activeCategory === cat
                                    ? "bg-dark text-volt border-dark shadow-md scale-105"
                                    : "bg-white text-gray-600 border-transparent hover:border-gray-400 hover:bg-gray-50"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredPrompts.map((prompt) => (
                        <PromptCard
                            key={prompt.slug}
                            prompt={prompt}
                            isFavorited={favSet.has(prompt.id)}
                            userId={userId}
                        />
                    ))}
                </div>

                {filteredPrompts.length === 0 && (
                    <div className="text-center py-20 text-gray-500 font-medium">
                        No prompts found in this category.
                    </div>
                )}
            </div>
        </div>
    );
}
