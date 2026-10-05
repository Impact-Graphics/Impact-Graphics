'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(promptId: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { error: "Unauthenticated", shouldRedirectLogin: true };
        }

        // Check if already favorited
        const { data: existing } = await supabase
            .from("favorites")
            .select("id")
            .eq("user_id", user.id)
            .eq("prompt_id", promptId)
            .maybeSingle();

        if (existing) {
            // Remove favorite
            const { error } = await supabase
                .from("favorites")
                .delete()
                .eq("user_id", user.id)
                .eq("prompt_id", promptId);

            if (error) {
                console.error("Error removing favorite:", error);
                return { error: error.message };
            }

            revalidatePath("/dashboard");
            revalidatePath("/library");
            return { isFavorited: false };
        } else {
            // Add favorite
            const { error } = await supabase
                .from("favorites")
                .insert({ user_id: user.id, prompt_id: promptId });

            if (error) {
                console.error("Error adding favorite:", error);
                return { error: error.message };
            }

            revalidatePath("/dashboard");
            revalidatePath("/library");
            return { isFavorited: true };
        }
    } catch (err) {
        console.error("Unexpected error in toggleFavoriteAction:", err);
        return { error: "Failed to toggle favorite" };
    }
}
