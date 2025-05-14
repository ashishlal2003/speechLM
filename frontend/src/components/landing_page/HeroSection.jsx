import {
    PlayCircle,
    Info
} from "lucide-react";

export default function HeroSection() {
    return (
        <header className="pt-40 pb-20 relative overflow-hidden ">
            {/* <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-[800px] h-[800px] border-[40px] border-orange-500 rounded-full animate-spin-slow"></div>
                <div className="absolute w-[600px] h-[600px] border-[30px] border-green-600 rounded-full animate-spin-slow-reverse"></div>
                <div className="absolute w-[400px] h-[400px] border-[20px] border-blue-500 rounded-full animate-spin-moderate"></div>
            </div> */}
            <div className="container mx-auto px-4 flex flex-col items-center z-10 relative ">
                <div className="text-center md:text-left md:pr-8 flex flex-col justify-center align-center">
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold leading-tight text-center">
                        <span className="bg-gradient-to-r from-orange-500 via-green-500 to-blue-600 bg-clip-text text-transparent">
                        Tvarā
                        </span>
                        <br />
                        The voice of Bhārat
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 px-36 text-center mx-auto md:mx-0">
                    Tvarā is a multilingual AI voice assistant with memory and understanding of Indian languages, accents, and cultural nuances — built for Bharat and beyond.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
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
    )
}

