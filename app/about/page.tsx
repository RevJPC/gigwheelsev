export default function AboutPage() {
    return (
        <div className="bg-slate-900 min-h-screen text-slate-300">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900 z-10"></div>
                {/* Fallback pattern or image if no asset available */}
                <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10"></div>
                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Driving the <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Future</span>
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed">
                        GigWheels EV is premier electric vehicle rental service. We are dedicated to providing a sustainable, high-performance, and luxurious driving experience.
                    </p>
                </div>
            </section>

            {/* Stats/Mission */}
            <section className="py-24 bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-700 hover:border-green-500/50 transition-colors">
                            <div className="text-4xl font-bold text-green-400 mb-2">100+</div>
                            <div className="text-white font-semibold mb-2">Premium EVs</div>
                            <p className="text-slate-400 text-sm">Top-tier Teslas, Lucids, and Rivians ready for your journey.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-700 hover:border-blue-500/50 transition-colors">
                            <div className="text-4xl font-bold text-blue-400 mb-2">0</div>
                            <div className="text-white font-semibold mb-2">Emissions</div>
                            <p className="text-slate-400 text-sm">Committed to a carbon-neutral future for transportation.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-700 hover:border-purple-500/50 transition-colors">
                            <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
                            <div className="text-white font-semibold mb-2">Support</div>
                            <p className="text-slate-400 text-sm">Our dedicated team is always here to assist you.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                        <p className="text-lg leading-relaxed mb-6 text-slate-400">
                            Founded in 2024, GigWheels EV started with a simple belief: you shouldn't have to compromise on performance to drive sustainably.
                        </p>
                        <p className="text-lg leading-relaxed text-slate-400">
                            We've curated a fleet of the world's most advanced electric vehicles, making them accessible for daily rentals, weekend getaways, and corporate fleets. We're not just renting cars; we're accelerating the transition to sustainable energy.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
                            <span className="text-slate-600 font-mono text-sm">[Add Office/Fleet Image Here]</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
