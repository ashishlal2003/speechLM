import { Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer({ scrollToRef, heroRef, featuresRef, testimonialsRef, pricingRef, contactRef }) {
  return (
    <footer className="bg-black border-t border-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Company info */}
          <div>
            <div className="flex items-center space-x-1 mb-6">
              <span className="text-2xl font-serif font-bold">T</span>
              <span className="text-2xl font-serif text-gray-300">VARA</span>
            </div>
            <p className="text-gray-500 mb-6">
              Voice intelligence with classical precision. TVARA delivers sophisticated voice assistance solutions with a timeless aesthetic.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-medium mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><button onClick={() => scrollToRef(heroRef)} className="text-gray-400 hover:text-white transition">Home</button></li>
              <li><button onClick={() => scrollToRef(featuresRef)} className="text-gray-400 hover:text-white transition">Features</button></li>
              <li><button onClick={() => scrollToRef(testimonialsRef)} className="text-gray-400 hover:text-white transition">Testimonials</button></li>
              <li><button onClick={() => scrollToRef(pricingRef)} className="text-gray-400 hover:text-white transition">Pricing</button></li>
              <li><button onClick={() => scrollToRef(contactRef)} className="text-gray-400 hover:text-white transition">Contact</button></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-medium mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Case Studies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-medium mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Licenses</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} TVARA. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition">Terms</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}