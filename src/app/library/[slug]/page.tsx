import { prompts } from "@/data/prompts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, AlertCircle, TrendingUp, Cpu } from "lucide-react";
import CopyButton from "@/components/CopyButton";

export default async function PromptDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const prompt = prompts.find((p) => p.slug === slug);

    if (!prompt) {
        notFound();
    }

    const isPremium = prompt.access === "Premium";

    return (
        <div className="bg-light text-dark py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
                {/* Back Link */}
                <Link
                    href="/library"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-dark font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Library
                </Link>

                {/* Main Content Card */}
                <div className="bg-white border-2 border-dark rounded-2xl p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
                    {/* Header Info */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-4 py-1.5 text-sm font-bold rounded-full bg-gray-100 border border-gray-200">
                            {prompt.category}
                        </span>
                        <span className={`px-4 py-1.5 text-sm font-bold rounded-full ${isPremium ? "bg-dark text-volt" : "bg-volt text-dark"}`}>
                            {prompt.access}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{prompt.title}</h1>
                    <p className="text-lg text-gray-600 font-medium mb-10">{prompt.description}</p>

                    {/* Top Attributes */}
                    <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-gray-400" />
                            <span className="font-bold text-gray-custom">Style:</span>
                            <span className="font-black text-dark">{prompt.style}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-gray-400" />
                            <span className="font-bold text-gray-custom">AI Tool:</span>
                            <span className="font-black text-dark">{prompt.aiTool}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-gray-400" />
                            <span className="font-bold text-gray-custom">Difficulty:</span>
                            <span className="font-black text-dark">{prompt.difficulty}</span>
                        </div>
                    </div>

                    {/* Prompt Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            The Prompt
                        </h2>
                        <div className="bg-dark text-light p-6 rounded-xl font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap selection:bg-volt selection:text-dark">
                            {prompt.prompt_text}
                        </div>

                        {isPremium && (
                            <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm font-semibold flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>This is a premium prompt, carefully optimized to yield breathtaking, high-quality results.</p>
                            </div>
                        )}

                        <CopyButton text={prompt.prompt_text} />
                    </div>

                    {/* Negative Prompt */}
                    {prompt.negative_prompt && (
                        <div className="mt-10 pt-10 border-t border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Negative Prompt</h2>
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-800 font-mono text-sm">
                                {prompt.negative_prompt}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
