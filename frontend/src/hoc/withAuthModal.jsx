import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const withAuthModal = (WrappedComponent) => {
    return function AuthenticatedComponent(props) {
        const [showModal, setShowModal] = useState(true);
        const [isVisible, setIsVisible] = useState(false);
        const navigate = useNavigate();

        useEffect(() => {
            const checkAuth = async () => {
                const isAuth = await check_is_authenticated();

                if (isAuth) {
                    setShowModal(false);
                } else {
                    const timer = setTimeout(() => setIsVisible(true), 50);
                    return () => clearTimeout(timer);
                }
            };

            checkAuth();
        }, []);


        const check_is_authenticated = async () => {
            const token = localStorage.getItem('token');
            console.log(token);


            if (token) {
                const isAuthenticated = await axios.post('http://localhost:8000/is_authenticated', { token: token });

                if (isAuthenticated.data.is_authenticated) {
                    return true;
                }

                return false;
            }

            return false;
        }

        const handleAuthChoice = (choice) => {

            // Add exit animation
            setIsVisible(false);

            // Close modal after animation
            setTimeout(() => {
                setShowModal(false);
            }, 400);

            switch (choice) {
                case 'login':
                    navigate("/login")
                    break;
                case 'signup':
                    navigate("/register")
                    break;
                case 'guest':
                    break;
                default:
                    break;
            }
        };

        // const handleBackdropClick = (e) => {
        //     if (e.target === e.currentTarget) {
        //         handleAuthChoice('guest');
        //     }
        // };

        if (!showModal) {
            return <WrappedComponent {...props} />;
        }

        return (
            <>
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ease-out ${isVisible
                        ? 'bg-slate-300/70 backdrop-blur-sm'
                        : 'bg-slate-300/0 backdrop-blur-none'
                        }`}
                // onClick={handleBackdropClick}
                >
                    <div
                        className={`relative w-full max-w-md transform transition-all duration-500 ease-out ${isVisible
                            ? 'scale-100 opacity-100 translate-y-0'
                            : 'scale-90 opacity-0 translate-y-8'
                            }`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 relative">

                            {/* Close Button */}
                            {/* <button
                                onClick={() => handleAuthChoice('guest')}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-50 hover:bg-slate-100 transition-all duration-200 group"
                            >
                                <X className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                            </button> */}

                            <div className="px-8 pt-10 pb-4 text-center">
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                    Welcome to {" "}
                                    <span className="text-xl font-bold bg-gradient-to-r from-orange-500 via-green-500 to-blue-600 bg-clip-text text-transparent">
                                        Tvara
                                    </span>

                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Great choice! Experience  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-600 font-semibold">
                                        intelligent conversations
                                    </span> crafted for you
                                </p>
                            </div>

                            <div className="px-8 pb-8 space-y-4 mt-6">

                                <button
                                    onClick={() => handleAuthChoice('login')}
                                    className="w-full group relative overflow-hidden bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-500 text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] shadow-md"
                                >
                                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                    <div className="relative">
                                        <span className="text-lg">Log in</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleAuthChoice('signup')}
                                    className="w-full group relative overflow-hidden border-2 border-green-500 text-green-600 hover:from-blue-600 hover:to-blue-700 font-semibold py-4 px-6 rounded-full transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] shadow-sm"
                                >
                                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                    <div className="relative">
                                        <span className="text-lg">Signup for free</span>
                                    </div>
                                </button>

                                <div className="relative mb-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-slate-400 font-medium">
                                            or
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAuthChoice('guest')}
                                    className="w-full group relative overflow-hidden bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-3 px-6 rounded-full transition-all duration-200 border border-slate-200 hover:border-slate-300"
                                >
                                    <div className="absolute inset-0 bg-slate-300/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                    <div className="relative">
                                        <span>Continue as Guest</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="opacity-0 pointer-events-none">
                    <WrappedComponent {...props} />
                </div>
            </>
        );
    };
};

export default withAuthModal;