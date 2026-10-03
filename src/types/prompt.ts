// Supabase Prompt type - matches the actual prompts table schema
export interface Prompt {
    id: string;
    slug: string;
    title: string;
    description: string;
    category: string;
    prompt_text: string;
    negative_prompt?: string;
    style: string;
    ai_tool: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    access: 'Free' | 'Premium';
    status: 'published' | 'draft';
    author_id?: string;
    image_url?: string;
    is_public?: boolean;
}
