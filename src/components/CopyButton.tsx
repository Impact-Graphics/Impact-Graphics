"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="mt-6 flex items-center justify-center gap-2 w-full sm:w-auto bg-volt text-dark font-bold text-lg px-8 py-4 rounded-lg hover:bg-[#cbe600] transition-colors shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
        >
            {copied ? (
                <>
                    <Check className="w-5 h-5 flex-shrink-0" />
                    Copied to Clipboard
                </>
            ) : (
                <>
                    <Copy className="w-5 h-5 flex-shrink-0" />
                    Copy Prompt
                </>
            )}
        </button>
    );
}
