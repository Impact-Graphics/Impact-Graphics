"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FavoriteButtonProps {
    promptId: string;
    userId: string | null;
    initialFavorited: boolean;
    /** Optional callback fired after a successful toggle */
    onToggle?: (isFavorited: boolean) => void;
}

export default function FavoriteButton({
    promptId,
    userId,
    initialFavorited,
    onToggle,
}: FavoriteButtonProps) {
    const router = useRouter();
    const [isFavorited, setIsFavorited] = useState(initialFavorited);
    const [loading, setLoading] = useState(false);

    async function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!userId) {
            router.push("/login");
            return;
        }

        if (loading) return;

        // Optimistic update
        const next = !isFavorited;
        setIsFavorited(next);
        setLoading(true);

        try {
            if (next) {
                // Add favorite
                const { error } = await supabase
                    .from("favorites")
                    .insert({ user_id: userId, prompt_id: promptId });
                if (error) throw error;
            } else {
                // Remove favorite
                const { error } = await supabase
                    .from("favorites")
                    .delete()
                    .eq("user_id", userId)
                    .eq("prompt_id", promptId);
                if (error) throw error;
            }
            onToggle?.(next);
        } catch {
            // Revert optimistic update on failure
            setIsFavorited(!next);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleClick}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            title={isFavorited ? "Remove from favorites" : "Save to favorites"}
            disabled={loading}
            className={`
                flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-200
                ${isFavorited
                    ? "bg-[#DFFF00] border-[#111111] text-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
                    : "bg-white border-gray-200 text-gray-400 hover:border-[#111111] hover:text-[#111111]"
                }
                ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:scale-110 active:scale-95"}
            `}
        >
            <Heart
                className="w-4 h-4"
                fill={isFavorited ? "currentColor" : "none"}
                strokeWidth={2.5}
            />
        </button>
    );
}
