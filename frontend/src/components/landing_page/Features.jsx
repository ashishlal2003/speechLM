import {
    Command,
    Settings,
    Sparkles
  } from "lucide-react";

function Features() {
    return (
        <section id="features" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        <span className="bg-gradient-to-r from-orange-500 via-green-500 to-blue-600 bg-clip-text text-transparent">
                            Intelligently Designed
                        </span>{" "}
                        For India
                    </h2>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Our voice assistant combines the richness of Indian cultural
                        heritage with cutting-edge AI technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Command className="h-8 w-8 text-orange-500" />,
                            title: "Multilingual Support",
                            description:
                                "Fluent in 22+ Indian languages and dialects, enabling natural conversations for everyone.",
                        },
                        {
                            icon: <Sparkles className="h-8 w-8 text-green-500" />,
                            title: "Cultural Context",
                            description:
                                "Understands Indian festivals, traditions, and cultural references for more meaningful interactions.",
                        },
                        {
                            icon: <Settings className="h-8 w-8 text-blue-600" />,
                            title: "Adaptive Learning",
                            description:
                                "Continuously improves based on your speech patterns and preferences.",
                        },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className="mb-4 p-3 bg-gray-50 rounded-full inline-block">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features