

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Command,
  Settings,
  Sparkles,
  PlayCircle,
  Info,
  Menu,
  X,
  ChevronRight,
  Hand,
} from "lucide-react";
import Animation from "./Animation";

export default function VoiceAssistantWebsite() {
  const [isListening, setIsListening] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const waveRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulated wave animation
  useEffect(() => {
    if (isListening && waveRef.current) {
      const interval = setInterval(() => {
        const bars = waveRef.current.querySelectorAll(".wave-bar");
        bars.forEach((bar) => {
          const height = Math.random() * 60 + 20;
          bar.style.height = `${height}px`;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-orange-50 text-gray-800 font-sans">
      {/* Floating Navbar */}
      <div className="container mx-auto px-4 relative z-50">
        <nav
          className={`fixed left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
            scrolled
              ? "top-4 w-11/12 md:w-10/12 lg:w-3/4 bg-white/95 shadow-lg rounded-xl backdrop-blur-sm"
              : "top-8 w-11/12 md:w-10/12 lg:w-3/4 bg-white/80 shadow-md rounded-xl"
          }`}
        >
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center shadow-md">
                <Hand className="text-white h-6 w-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 via-green-500 to-blue-600 bg-clip-text text-transparent">
                Tvara
              </span>
            </div>

            <div className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="hover:text-green-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hover:text-green-600 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="hover:text-green-600 transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="hover:text-green-600 transition-colors"
              >
                Pricing
              </a>
            </div>

            <button className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-green-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all">
              <span>Try Now</span>
              <Mic className="h-4 w-4" />
            </button>

            <button
              className="md:hidden text-gray-700"
              onClick={() => setNavVisible(!navVisible)}
            >
              {navVisible ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          <div
            className={`md:hidden bg-white absolute w-full shadow-md rounded-b-xl transition-all duration-300 ${
              navVisible
                ? "max-h-64 opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="container mx-auto px-6 py-2 flex flex-col space-y-3">
              <a href="#features" className="py-2 border-b border-gray-100">
                Features
              </a>
              <a href="#how-it-works" className="py-2 border-b border-gray-100">
                How It Works
              </a>
              <a href="#testimonials" className="py-2 border-b border-gray-100">
                Testimonials
              </a>
              <a href="#pricing" className="py-2">
                Pricing
              </a>
              <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-green-500 text-white px-4 py-2 rounded-full">
                <span>Try Now</span>
                <Mic className="h-4 w-4" />
              </button>
            </div>
          </div>
        </nav>
      </div>
      {/* Hero Section */}
      <header className="pt-40 pb-20 relative overflow-hidden ">
        <div className="absolute right-0  -bottom-10 md:-bottom-40 w-[80%] md:w-[50%] z-0 animate-fade-in-out">
          <Animation />
        </div>
        {/* bg-white/69 rounded-lg shadow-md backdrop-blur-[9.1px] border border-white/33 */}
        <div className="container mx-auto px-4 flex flex-col items-center z-10 relative ">
          <div className="text-center md:text-left md:pr-8">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold leading-tight text-center">
              <span className="bg-gradient-to-r from-orange-500 via-green-500 to-blue-600 bg-clip-text text-transparent">
                Voice Intelligence
              </span>
              <br />
              Inspired by India
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
              Experience the fusion of ancient wisdom and modern AI. Our voice
              assistant understands Indian languages, accents, and cultural
              nuances.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-gradient-to-r from-orange-500 to-green-500 text-white px-8 py-3 rounded-full flex items-center justify-center space-x-2 hover:shadow-lg transform hover:-translate-y-1 transition-all">
                <span>Start Free Trial</span>
                <PlayCircle className="h-5 w-5" />
              </button>
              <button className="border-2 border-green-500 text-green-600 px-8 py-3 rounded-full flex items-center justify-center space-x-2 hover:bg-green-50 transition-all">
                <span>Watch Demo</span>
                <Info className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
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

      {/* How It Works Section */}
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-orange-500 via-green-500 to-blue-600 bg-clip-text text-transparent">
                What Our Users Say
              </span>
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users across India experiencing the
              future of voice assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                location: "Delhi",
                text: "The multilingual support is amazing! It understands my Hindi-English mix perfectly, which other assistants always struggled with.",
              },
              {
                name: "Rajesh Patel",
                location: "Ahmedabad",
                text: "I love how it understands cultural context. When I ask about Diwali preparations, it gives relevant suggestions instead of generic responses.",
              },
              {
                name: "Ananya Krishnan",
                location: "Bangalore",
                text: "The voice recognition is exceptional even with my South Indian accent. It's the first assistant that truly feels made for India.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-300 to-green-300 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
                <div className="mt-4 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
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
                className={`rounded-xl p-6 ${
                  plan.highlighted
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
                  className={`w-full py-3 rounded-full ${
                    plan.highlighted
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

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-orange-500 to-green-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience the Voice of India
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-white/90">
            Join thousands of users discovering the power of AI voice assistance
            designed specifically for India.
          </p>
          <button className="bg-white text-gray-800 px-8 py-3 rounded-full font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all">
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Integration
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
                <Hand className="text-white h-4 w-4" />
              </div>
              <span className="text-lg font-bold">Tvara.AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Tvara AI Technologies. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom CSS */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .pulse-animation {
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes spin-reverse-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(-360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }

        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 25s linear infinite;
        }
        @keyframes fade-in-out {
          0% {
            opacity: 0.1;
          }
          25% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.40;
          }
          75% {
            opacity: 0.25;
          }
          100% {
            opacity: 0.1;
          }
        }

        .animate-fade-in-out {
          animation: fade-in-out 9s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
