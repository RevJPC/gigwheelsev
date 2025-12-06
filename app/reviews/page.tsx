import { FaStar } from 'react-icons/fa';

export default function ReviewsPage() {
    const reviews = [
        {
            id: 1,
            name: "Sarah Jenkins",
            role: "Business Traveler",
            rating: 5,
            content: "The Model S Plaid was absolutely mind-blowing. The pickup process was seamless, and the car was in pristine condition. GigWheels is my go-to for all business trips now.",
            date: "Dec 1, 2024"
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Weekend Explorer",
            rating: 5,
            content: "Rented a Rivian R1T for a camping trip. The range was incredible, and the storage space made packing a breeze. Highly recommended!",
            date: "Nov 28, 2024"
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            role: "Daily Commuter",
            rating: 4,
            content: "Great service and friendly staff. The Model 3 is perfect for city driving. Only giving 4 stars because I wish they had more color options, but otherwise perfect.",
            date: "Nov 15, 2024"
        },
        {
            id: 4,
            name: "David Kim",
            role: "Tech Enthusiast",
            rating: 5,
            content: "Finally got to try the Lucid Air. It lives up to the hype. Thanks GigWheels for having such an exclusive fleet available.",
            date: "Oct 30, 2024"
        }
    ];

    return (
        <div className="bg-slate-900 min-h-screen text-slate-300 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">What Our Clients Say</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        We pride ourselves on providing an exceptional experience. Here's what our community has to say about driving with us.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all hover:-translate-y-1">
                            <div className="flex items-center space-x-1 mb-4 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < review.rating ? "fill-current" : "text-slate-600"} />
                                ))}
                            </div>
                            <p className="text-slate-300 mb-6 italic">"{review.content}"</p>
                            <div className="flex items-center justify-between border-t border-slate-700 pt-4">
                                <div>
                                    <h4 className="font-semibold text-white">{review.name}</h4>
                                    <span className="text-xs text-slate-400">{review.role}</span>
                                </div>
                                <span className="text-xs text-slate-500">{review.date}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-20 text-center">
                    <div className="inline-block p-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500">
                        <button className="px-8 py-3 bg-slate-900 rounded-full text-white font-semibold hover:bg-slate-800 transition-colors">
                            Leave a Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
