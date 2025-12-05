import Link from 'next/link';

export default function DataDeletion() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
                <div className="mb-8 border-b border-slate-700 pb-4">
                    <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Data Deletion Instructions</h1>
                </div>

                <div className="space-y-6">
                    <section>
                        <p className="leading-relaxed">
                            In accordance with Meta/Facebook Platform Terms and our commitment to user privacy, GigWheels EV provides a clear way for users to request the deletion of their personal data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">How to Request Data Deletion</h2>
                        <p className="leading-relaxed mb-4">
                            If you used Facebook Login to access GigWheels EV and wish to delete your account and associated data, please follow these steps:
                        </p>

                        <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
                            <h3 className="text-lg font-medium text-white mb-2">Option 1: Contact Us Directly</h3>
                            <p className="mb-4">
                                Send an email to our support team with the subject line <strong>"Data Deletion Request"</strong>.
                            </p>
                            <ul className="list-none space-y-2 mb-4">
                                <li><strong>Email:</strong> <a href="mailto:info@gigwheelsev.com" className="text-blue-400 hover:text-blue-300">info@gigwheelsev.com</a></li>
                            </ul>
                            <p className="text-sm text-slate-400">
                                Please send the email from the address associated with your account so we can verify your identity.
                            </p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-white mb-2">Option 2: Remove App via Facebook</h3>
                            <p className="mb-2">You can also remove the app from your Facebook settings:</p>
                            <ol className="list-decimal pl-5 space-y-1 text-slate-300">
                                <li>Go to your Facebook Account <strong>Settings & Privacy</strong> &gt; <strong>Settings</strong>.</li>
                                <li>Look for <strong>Apps and Websites</strong>.</li>
                                <li>Find <strong>GigWheels EV</strong> in the list.</li>
                                <li>Click <strong>Remove</strong>.</li>
                            </ol>
                            <p className="mt-4 text-sm text-slate-400">
                                Note: Removing the app from Facebook revokes our access to your info but does not automatically delete data we have already stored. Please use Option 1 to request full removal of stored data from our servers.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
