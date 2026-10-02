import Link from "next/link";
import { ArrowRight, Search, Copy, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-dark text-light relative overflow-hidden py-24 md:py-32 flex flex-col items-center text-center px-4">
        {/* Abstract shapes for background */}
        <div className="absolute -top-[20%] -left-[10%] w-96 h-96 bg-volt/20 rounded-full blur-3xl" />
        <div className="absolute top-[40%] -right-[10%] w-[30rem] h-[30rem] bg-gray-600/20 rounded-full blur-3xl" />

        <div className="z-10 max-w-4xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white mb-6">
            Unlock Premium <span className="text-volt">AI Prompts</span> for Stunning Graphic Design
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto">
            Discover, save, and use expertly crafted prompts built for designers, brands, and creators — powered by AI.
          </p>
          <div className="pt-8">
            <Link
              href="/library"
              className="inline-flex items-center gap-2 bg-volt text-dark font-bold text-lg px-8 py-4 rounded-lg hover:scale-105 hover:bg-volt/90 transition-all shadow-lg hover:shadow-volt/20"
            >
              Explore the Vault
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-24 bg-light text-dark flex flex-col items-center px-4">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">How It Works</h2>
            <p className="text-lg text-gray font-medium">Three simple steps to elevate your design process.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1: Browse */}
            <div className="bg-white border-2 border-dark rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-volt border-2 border-dark rounded-lg flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-dark" />
              </div>
              <h3 className="text-2xl font-bold mb-3">1. Browse</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                Explore a curated library of premium prompts across 6 graphic design categories.
              </p>
            </div>

            {/* Step 2: Copy */}
            <div className="bg-white border-2 border-dark rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-volt border-2 border-dark rounded-lg flex items-center justify-center mb-6">
                <Copy className="w-8 h-8 text-dark" />
              </div>
              <h3 className="text-2xl font-bold mb-3">2. Copy</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                Grab the exact prompt text in just one click, carefully formatted for optimal AI output.
              </p>
            </div>

            {/* Step 3: Create */}
            <div className="bg-white border-2 border-dark rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-volt border-2 border-dark rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-dark" />
              </div>
              <h3 className="text-2xl font-bold mb-3">3. Create</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                Paste into your favorite AI vision tool and generate stunning, high-quality graphics instantly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
