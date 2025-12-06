import Link from 'next/link';
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaFacebook } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4 inline-block">
                            GigWheels EV
                        </Link>
                        <p className="text-sm text-slate-400 mb-4">
                            Premium electric vehicle fleet management and rental services. Experience the future of transportation.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com/YOUR_PAGE" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                                <FaFacebook className="h-6 w-6" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                <FaTwitter className="h-6 w-6" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-400 transition-colors">
                                <FaInstagram className="h-6 w-6" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                                <FaLinkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="hover:text-amber-400 transition-colors text-sm">About Us</Link>
                            </li>
                            <li>
                                <Link href="/reviews" className="hover:text-amber-400 transition-colors text-sm">Reviews</Link>
                            </li>
                            <li>
                                <Link href="/social" className="hover:text-amber-400 transition-colors text-sm">Social Media</Link>
                            </li>
                            <li>
                                <Link href="/careers" className="hover:text-amber-400 transition-colors text-sm">Careers</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/help" className="hover:text-amber-400 transition-colors text-sm">Help Center</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-amber-400 transition-colors text-sm">Contact Us</Link>
                            </li>
                            <li>
                                <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors text-sm">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-amber-400 transition-colors text-sm">Terms of Service</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Contact</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>123 EV Street</li>
                            <li>Innovation City, tech 90210</li>
                            <li>
                                <a href="mailto:info@gigwheelsev.com" className="hover:text-white transition-colors">info@gigwheelsev.com</a>
                            </li>
                            <li>+1 (555) 123-4567</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                    <p>&copy; {currentYear} GigWheels EV. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
