import React from 'react'

function Pricing() {
    return (
        <section
            id="pricing"
            className="py-16 md:py-24 bg-gradient-to-b from-indigo-50 to-orange-50"
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        <span className="bg-gradient-to-r from-orange-500 via-green-500 to-blue-600 bg-clip-text text-transparent">
                            Simple Pricing
                        </span>
                    </h2>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Choose the plan that works best for you and your needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        {
                            name: "Basic",
                            price: "Free",
                            features: [
                                "Hindi & English support",
                                "Basic voice commands",
                                "Limited daily queries",
                                "Community support",
                            ],
                            buttonText: "Start Free",
                            highlighted: false,
                        },
                        {
                            name: "Premium",
                            price: "₹299/month",
                            features: [
                                "8 Indian languages",
                                "Advanced voice AI",
                                "Unlimited queries",
                                "Priority support",
                                "No advertisements",
                            ],
                            buttonText: "Get Premium",
                            highlighted: true,
                        },
                        {
                            name: "Business",
                            price: "₹999/month",
                            features: [
                                "All 22+ Indian languages",
                                "Custom voice training",
                                "API access",
                                "Dedicated support",
                                "Custom integration",
                            ],
                            buttonText: "Contact Sales",
                            highlighted: false,
                        },
                    ].map((plan, index) => (
                        <div
                            key={index}
                            className={`rounded-xl p-6 ${plan.highlighted
                                    ? "bg-gradient-to-b from-white to-green-50 shadow-lg border-2 border-green-100 transform scale-105"
                                    : "bg-white shadow-md border border-gray-100"
                                }`}
                        >
                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="mb-6">
                                <span className="text-3xl font-bold">{plan.price}</span>
                                {plan.price !== "Free" && (
                                    <span className="text-gray-500 text-sm"> /month</span>
                                )}
                            </div>
                            <ul className="mb-8 space-y-3">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-green-500 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className={`w-full py-3 rounded-full ${plan.highlighted
                                        ? "bg-gradient-to-r from-orange-500 to-green-500 text-white"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    } transition-colors font-medium`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Pricing