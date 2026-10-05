import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import PromptCard from "@/components/PromptCard";
import { Prompt } from "@/types/prompt";
import { BookMarked, Library } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch favorites joined with prompts
    const { data: favoritesData } = await supabase
        .from("favorites")
        .select("prompt_id, prompts(*)")
        .eq("user_id", user.id);

    const favoritePrompts: Prompt[] = (favoritesData ?? [])
        .map((f) => f.prompts as unknown as Prompt)
        .filter(Boolean);

    const favoritedIds = new Set(favoritePrompts.map((p) => p.id));

    return (
        <div className="bg-[#F5F5F5] min-h-screen py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-6xl space-y-10">

                {/* Welcome card */}
                <div className="bg-white rounded-2xl border-2 border-[#111111] p-8 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]">
                    <h1 className="text-3xl font-black text-[#111111] mb-2">Your Dashboard</h1>
                    <div className="flex flex-col gap-2 mt-4">
                        <p className="text-[#6B7280] font-medium">Logged in as:</p>
                        <p className="font-mono bg-[#F5F5F5] p-3 rounded-lg text-sm text-[#111111] border border-gray-200 inline-block">
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Favorites section */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#DFFF00] border-2 border-[#111111] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]">
                            <BookMarked className="w-5 h-5 text-[#111111]" />
                        </div>
                        <h2 className="text-2xl font-black text-[#111111]">Your Favorites</h2>
                        {favoritePrompts.length > 0 && (
                            <span className="ml-1 px-3 py-0.5 rounded-full bg-[#111111] text-[#DFFF00] text-sm font-black">
                                {favoritePrompts.length}
                            </span>
                        )}
                    </div>

                    {favoritePrompts.length === 0 ? (
                        /* Empty state */
                        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                            <Library className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-black text-[#111111] mb-2">No saved prompts yet</h3>
                            <p className="text-[#6B7280] font-medium mb-6">
                                You haven&apos;t saved any prompts yet — browse the library to get started.
                            </p>
                            <Link
                                href="/library"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#DFFF00] text-[#111111] font-black rounded-full border-2 border-[#111111] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] hover:shadow-[5px_5px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-0.5 transition-all"
                            >
                                Browse Prompt Library →
                            </Link>
                        </div>
                    ) : (
                        /* Favorites grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoritePrompts.map((prompt) => (
                                <PromptCard
                                    key={prompt.id}
                                    prompt={prompt}
                                    isFavorited={favoritedIds.has(prompt.id)}
                                    userId={user.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
