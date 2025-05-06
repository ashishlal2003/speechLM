import React, { useState } from "react";
import {
    Mic,
    Menu,
    X
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar({ scrolled }) {

    const [navVisible, setNavVisible] = useState(false);
    return (
        <div className="container mx-auto px-4 relative z-50">
            <nav
                className={`fixed left-1/2 transform -translate-x-1/2 transition-all duration-300 ${scrolled
                    ? "top-4 w-11/12 md:w-10/12 lg:w-3/4 bg-white/95 shadow-lg rounded-4xl backdrop-blur-sm"
                    : "top-8 w-11/12 md:w-10/12 lg:w-3/4 bg-white/80 shadow-md rounded-4xl"
                    }`}
            >
                <div className="flex justify-between items-center px-6 py-4">
                    <div className="flex items-center space-x-2">
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

                    <Link to="/tvara">
                        <button className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-green-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all">
                            <span>Try Now</span>
                            <Mic className="h-4 w-4" />
                        </button>
                    </Link>

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
                    className={`md:hidden bg-white absolute w-full shadow-md rounded-b-xl transition-all duration-300 ${navVisible
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
    );
}