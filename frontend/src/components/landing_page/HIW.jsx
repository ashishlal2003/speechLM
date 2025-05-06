import {
    ChevronRight,
  } from "lucide-react";

function HIW() {
    return (
        <section
            id="how-it-works"
            className="py-16 md:py-24 bg-gradient-to-b from-indigo-50 to-orange-50"
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        <span className="bg-gradient-to-r from-orange-500 via-green-500 to-blue-600 bg-clip-text text-transparent">
                            How It Works
                        </span>
                    </h2>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Simple, intuitive, and powerful. Our voice assistant seamlessly
                        integrates into your daily life.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center space-y-12 md:space-y-0 md:space-x-8">
                    {[
                        {
                            step: 1,
                            title: "Speak Naturally",
                            description:
                                "Simply talk in your preferred Indian language or dialect.",
                        },
                        {
                            step: 2,
                            title: "AI Processing",
                            description:
                                "Our advanced neural networks understand context and intent.",
                        },
                        {
                            step: 3,
                            title: "Immediate Response",
                            description:
                                "Get helpful, culturally-aware responses instantly.",
                        },
                    ].map((step, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center max-w-xs text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-green-500 flex items-center justify-center text-white text-xl font-bold mb-6">
                                {step.step}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>

                            {index < 2 && (
                                <div className="hidden md:block mt-6">
                                    <ChevronRight className="w-8 h-8 text-gray-300" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HIW