import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import Footer from '../components/Footer'
import ContactSection from '../components/ContactSection'
import FeaturesSection from '../components/feature-section/FeaturesSection'
import TestimonialsSection from '../components/testimonial-section/TestimonialsSection'
import PricingSection from '../components/pricing-plan/PricingSection'
import { useState, useEffect, useRef } from 'react';

export default function LandingPage() {
  // Loading state
  const [isLoaded, setIsLoaded] = useState(false);
  // Scroll position state
  const [scrollY, setScrollY] = useState(0);
  
  // Refs for scrolling to sections
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const pricingRef = useRef(null);
  const contactRef = useRef(null);

  // Function to scroll to a ref
  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100, // Offset to account for navbar
        behavior: 'smooth'
      });
    }
  };

  // Handle scroll position updates
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate loading delay and then set isLoaded to true
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
          <div className="bg-black text-white min-h-screen">
            <Navbar 
              scrollToRef={scrollToRef}
              heroRef={heroRef}
              featuresRef={featuresRef}
              testimonialsRef={testimonialsRef}
              pricingRef={pricingRef}
              contactRef={contactRef}
              isLoaded={isLoaded}
            />
            
            <main>
              <HeroSection 
                heroRef={heroRef}
                scrollToRef={scrollToRef}
                featuresRef={featuresRef}
                isLoaded={isLoaded}
                scrollY={scrollY}
              />
              
              <FeaturesSection 
                featuresRef={featuresRef}
                scrollY={scrollY}
              />
              
              <TestimonialsSection 
                testimonialsRef={testimonialsRef}
                scrollY={scrollY}
              />
              
              <PricingSection 
                pricingRef={pricingRef}
                scrollY={scrollY}
              />
              
              <ContactSection 
                contactRef={contactRef}
              />
            </main>
            
            <Footer 
              scrollToRef={scrollToRef}
              heroRef={heroRef}
              featuresRef={featuresRef}
              testimonialsRef={testimonialsRef}
              pricingRef={pricingRef}
              contactRef={contactRef}
            />
          </div>
       
  );
}