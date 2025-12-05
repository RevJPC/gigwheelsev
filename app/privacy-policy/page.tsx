import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
                <div className="mb-8 border-b border-slate-700 pb-4">
                    <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                    <p className="mt-2 text-sm text-slate-400">Last updated: December 5, 2024</p>
                </div>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
                        <p className="leading-relaxed">
                            Welcome to GigWheels EV ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you understand how your information is collected, used, and shared. This Privacy Policy explains our practices regarding your information when you use our application and services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
                        <p className="leading-relaxed mb-2">We collect information you provide directly to us, including:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Account information (name, email address, phone number) provided during signup or social login (Google, Facebook).</li>
                            <li>Profile information (address, driver's license details) for vehicle rentals.</li>
                            <li>Reservation details and rental history.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
                        <p className="leading-relaxed mb-2">We use the collected information to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Provide, maintain, and improve our services.</li>
                            <li>Process transactions and manage vehicle rentals.</li>
                            <li>Authenticate your identity and secure your account.</li>
                            <li>Communicate with you about your reservations and account updates.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">4. Data Sharing and Disclosure</h2>
                        <p className="leading-relaxed">
                            We do not sell your personal data. We may share your information with third-party service providers (like AWS for hosting and authentication) only as necessary to provide our services. We may also disclose information if required by law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">5. Data Deletion</h2>
                        <p className="leading-relaxed">
                            You have the right to request deletion of your personal data. You can delete your account through the application settings or by contacting us at info@gigwheelsev.com.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">6. Contact Us</h2>
                        <p className="leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:
                            <br />
                            <a href="mailto:info@gigwheelsev.com" className="text-blue-400 hover:text-blue-300">info@gigwheelsev.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
