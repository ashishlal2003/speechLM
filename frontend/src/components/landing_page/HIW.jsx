import { ChevronRight } from "lucide-react";

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
            A harmonious blend of speech, culture, and AI. Here's how Tvarā flows.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8 space-y-12 md:space-y-0 relative px-12">
          {[
            {
              step: 1,
              title: "Speak Naturally",
              description:
                "Talk in your mother tongue — Hindi, Tamil, Assamese, or any of the 22+ supported languages.",
            },
            {
              step: 2,
              title: "Contextual Understanding",
              description:
                "AI listens like a true Bhāratiya — grasping tone, meaning, and emotion.",
            },
            {
              step: 3,
              title: "Culturally Aware Response",
              description:
                "Responds with intelligence that's aware of your world — your festivals, greetings, and values.",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center max-w-sm relative"
            >
              <div className="w-16 h-16 rounded-full border-4 border-orange-400 bg-white text-orange-600 font-bold text-xl flex items-center justify-center shadow-md mb-4 hover:scale-105 transition-transform">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>

              {/* Chevron for flow */}
              {index < 2 && (
                <div className="hidden md:block absolute right-[-2.5rem] top-8">
                  <ChevronRight className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HIW;
