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
                Intelligently Woven
              </span>{" "}
              From Bhārat, For the World
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Rooted in dharma, powered by intelligence — Tvarā is your AI friend and agent that understands, acts, and grows with you.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12">
            {[
              {
                icon: <Command className="h-7 w-7 text-orange-600" />,
                title: "Bhashā Sampanna",
                description:
                  "Currently fluent in English, with upcoming support for 22+ Indian languages — conversations that will feel like home.",
                gradient: "from-orange-100 via-orange-50 to-white",
                ringColor: "ring-orange-300"
              },
              {
                icon: <Sparkles className="h-7 w-7 text-green-600" />,
                title: "Culturally Conscious",
                description:
                  "Your AI friend who understands Indian culture and context. Tvarā resonates with the rhythm of Indian life.",
                gradient: "from-green-100 via-green-50 to-white",
                ringColor: "ring-green-300"
              },
              {
                icon: <Settings className="h-7 w-7 text-blue-600" />,
                title: "Agent with Tools",
                description:
                  "More than conversation — Tvarā uses multiple tools to get things done, learning and adapting through every interaction.",
                gradient: "from-blue-100 via-blue-50 to-white",
                ringColor: "ring-blue-300"
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${feature.gradient} p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-1 hover:scale-[1.02] transition-transform duration-300`}
              >
                <div
                  className={`mb-4 p-4 bg-white rounded-full ring-4 ${feature.ringColor} shadow-sm w-fit mx-auto`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  export default Features;