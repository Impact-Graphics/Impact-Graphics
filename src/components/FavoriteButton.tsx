"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toggleFavoriteAction } from "@/app/actions/favorite";

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

    useEffect(() => {
        setIsFavorited(initialFavorited);
    }, [initialFavorited]);

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
            const res = await toggleFavoriteAction(promptId);

            if (res.shouldRedirectLogin) {
                setIsFavorited(!next);
                router.push("/login");
                return;
            }

            if (res.error) {
                console.error("Favorite toggle failed:", res.error);
                // Revert optimistic update on error
                setIsFavorited(!next);
                return;
            }

            if (typeof res.isFavorited === "boolean") {
                setIsFavorited(res.isFavorited);
                onToggle?.(res.isFavorited);
            }
        } catch (error) {
            console.error("Error in favorite click handler:", error);
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
