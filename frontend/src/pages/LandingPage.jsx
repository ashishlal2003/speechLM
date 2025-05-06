import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/landing_page/Navbar";
import HeroSection from "../components/landing_page/HeroSection";
import Features from "../components/landing_page/Features";
import HIW from "../components/landing_page/HIW";
import Pricing from "../components/landing_page/Pricing";
import CTA from "../components/landing_page/CTA";
import Footer from "../components/landing_page/Footer";
import Testinomials from "../components/landing_page/Testinomials";

export default function Temp2() {
  const [isListening, setIsListening] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const waveRef = useRef(null);


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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-orange-50 text-gray-800 font-sans">
      {/* Floating Navbar */}
      <Navbar scrolled={scrolled} />

      {/* Hero Section */}
      <HeroSection />


      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HIW />

      {/* Testimonials Section */}
      <Testinomials />

      {/* Pricing Section */}
      <Pricing />


      {/* CTA Section */}
      <CTA />


      {/* Footer */}
      <Footer />


      {/* Custom CSS */}
      <style jsx global>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spin-slow-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        @keyframes spin-moderate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(180deg); }
        }

        @keyframes spin-very-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spin-very-slow-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        @keyframes ripple {
          0% {
            transform: scale(0.5);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.5;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 15s linear infinite;
        }

        .animate-spin-moderate {
          animation: spin-moderate 12s linear infinite alternate;
        }

        .animate-spin-very-slow {
          animation: spin-very-slow 30s linear infinite;
        }

        .animate-spin-very-slow-reverse {
          animation: spin-very-slow-reverse 25s linear infinite;
        }

        .animate-ripple {
          animation: ripple 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
