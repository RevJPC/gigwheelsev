import { FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok, FaFacebook } from 'react-icons/fa';

export default function SocialPage() {
    return (
        <div className="bg-slate-900 min-h-screen text-slate-300 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Join the Community</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Follow us for the latest fleet updates, EV news, and community stories. Tag us @GigWheelsEV to be featured!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    <a href="#" className="group flex flex-col items-center p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-pink-500/50 transition-all hover:-translate-y-1">
                        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 transition-all">
                            <FaInstagram className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Instagram</h3>
                        <p className="text-sm text-slate-400">@GigWheelsEV</p>
                    </a>

                    <a href="https://facebook.com/gigwheelsev" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-600/50 transition-all hover:-translate-y-1">
                        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-all">
                            <FaFacebook className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Facebook</h3>
                        <p className="text-sm text-slate-400">GigWheels EV</p>
                    </a>

                    <a href="https://twitter.com/YOUR_HANDLE" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-400/50 transition-all hover:-translate-y-1">
                        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4 group-hover:bg-blue-400 transition-all">
                            <FaTwitter className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">X / Twitter</h3>
                        <p className="text-sm text-slate-400">@GigWheelsEV</p>
                    </a>

                    <a href="#" className="group flex flex-col items-center p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-700/50 transition-all hover:-translate-y-1">
                        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4 group-hover:bg-blue-700 transition-all">
                            <FaLinkedin className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">LinkedIn</h3>
                        <p className="text-sm text-slate-400">GigWheels Inc.</p>
                    </a>

                    <a href="#" className="group flex flex-col items-center p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-black/50 transition-all hover:-translate-y-1">
                        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4 group-hover:bg-black transition-all">
                            <FaTiktok className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">TikTok</h3>
                        <p className="text-sm text-slate-400">@GigWheelsEV</p>
                    </a>
                </div>

                {/* Feed Placeholder / Grid */}
                <h2 className="text-2xl font-bold text-white mb-8 border-b border-slate-800 pb-4">Latest Highlights</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-96">
                    <div className="col-span-2 row-span-2 bg-slate-800 rounded-xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-slate-700 animate-pulse"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-mono text-sm">[Featured Post]</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-slate-700/50"></div>
                    </div>
                    <div className="bg-slate-800 rounded-xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-slate-700/50"></div>
                    </div>
                    <div className="bg-slate-800 rounded-xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-slate-700/50"></div>
                    </div>
                    <div className="bg-slate-800 rounded-xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-slate-700/50"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
