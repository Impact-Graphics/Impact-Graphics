import { createPublicClient } from "@/utils/supabase/public";
import { createClient } from "@/utils/supabase/server";
import LibraryClient from "./LibraryClient";

const CATEGORIES = [
    "All",
    "Logo & Brand Identity",
    "Digital Design",
    "Social Media Graphics",
    "T-Shirt & Apparel",
    "AI Art & Illustration",
    "Advertising & Marketing",
];

export default async function LibraryPage() {
    // Fetch public prompts — no auth required
    const supabase = createPublicClient();
    const { data: prompts, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("status", "published")
        .order("id", { ascending: false });

    if (error) {
        console.error("Error fetching prompts:", JSON.stringify(error));
    }

    // Fetch auth user + their favorites (if logged in)
    let userId: string | null = null;
    let favoritedIds: string[] = [];

    try {
        const authClient = await createClient();
        const { data: { user } } = await authClient.auth.getUser();

        if (user) {
            userId = user.id;
            const { data: favs } = await authClient
                .from("favorites")
                .select("prompt_id")
                .eq("user_id", user.id);

            if (favs) {
                favoritedIds = favs.map((f) => f.prompt_id);
            }
        }
    } catch {
        // Not logged in — continue without favorites
    }

    return (
        <LibraryClient
            prompts={prompts ?? []}
            categories={CATEGORIES}
            userId={userId}
            favoritedIds={favoritedIds}
        />
    );
}
