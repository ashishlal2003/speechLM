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


////////////////////////////

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Menu, X, User, LogIn, UserPlus } from 'lucide-react';

// const withAuthModal = (WrappedComponent) => {
//     return function AuthenticatedComponent(props) {
//         const [showModal, setShowModal] = useState(true);
//         const [isVisible, setIsVisible] = useState(false);
//         const [isAuthenticated, setIsAuthenticated] = useState(false);
//         const [userInfo, setUserInfo] = useState(null);
//         const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
//         const [navbarVisible, setNavbarVisible] = useState(false);
//         const navigate = useNavigate();

//         useEffect(() => {
//             const timer = setTimeout(() => setIsVisible(true), 50);
//             return () => clearTimeout(timer);
//         }, []);

//         // Show navbar with smooth animation after modal closes
//         useEffect(() => {
//             if (!showModal) {
//                 const timer = setTimeout(() => setNavbarVisible(true), 100);
//                 return () => clearTimeout(timer);
//             }
//         }, [showModal]);

//         const handleAuthChoice = (choice) => {
//             // Add exit animation
//             setIsVisible(false);

//             // Close modal after animation
//             setTimeout(() => {
//                 setShowModal(false);
                
//                 // Handle different auth choices
//                 switch (choice) {
//                     case 'login':
//                         navigate("/log-in");
//                         break;
//                     case 'signup':
//                         navigate("/create-account");
//                         break;
//                     case 'guest':
//                         setIsAuthenticated(false);
//                         setUserInfo(null);
//                         break;
//                     default:
//                         break;
//                 }
//             }, 400);
//         };

//         // Mock function to simulate user login (you can replace this with actual auth logic)
//         const handleLogin = () => {
//             setIsAuthenticated(true);
//             setUserInfo({ name: 'John Doe', email: 'john@example.com' });
//         };

//         const handleLogout = () => {
//             setIsAuthenticated(false);
//             setUserInfo(null);
//             setSideDrawerOpen(false);
//         };

//         const toggleSideDrawer = () => {
//             setSideDrawerOpen(!sideDrawerOpen);
//         };

//         const getUserInitial = () => {
//             return userInfo?.name?.charAt(0)?.toUpperCase() || 'U';
//         };

//         // Side Drawer Component
//         const SideDrawer = () => (
//             <>
//                 {/* Backdrop */}
//                 <div 
//                     className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ease-in-out ${
//                         sideDrawerOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
//                     }`}
//                     onClick={() => setSideDrawerOpen(false)}
//                 />
                
//                 {/* Drawer */}
//                 <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
//                     sideDrawerOpen ? 'translate-x-0' : '-translate-x-full'
//                 }`}>
//                     <div className="p-6 border-b border-slate-200">
//                         <div className="flex items-center justify-between">
//                             <h2 className="text-xl font-bold text-slate-800">Menu</h2>
//                             <button
//                                 onClick={() => setSideDrawerOpen(false)}
//                                 className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200"
//                             >
//                                 <X className="w-5 h-5 text-slate-600" />
//                             </button>
//                         </div>
//                     </div>
                    
//                     <div className="p-6">
//                         {isAuthenticated && userInfo && (
//                             <div className="mb-8 p-4 bg-slate-50 rounded-lg">
//                                 <div className="flex items-center space-x-3">
//                                     <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
//                                         {getUserInitial()}
//                                     </div>
//                                     <div>
//                                         <h3 className="font-semibold text-slate-800">{userInfo.name}</h3>
//                                         <p className="text-sm text-slate-600">{userInfo.email}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
                        
//                         <nav className="space-y-2">
//                             <a href="#" className="block px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200">
//                                 Dashboard
//                             </a>
//                             <a href="#" className="block px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200">
//                                 Settings
//                             </a>
//                             <a href="#" className="block px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200">
//                                 Help
//                             </a>
//                             {isAuthenticated && (
//                                 <button
//                                     onClick={handleLogout}
//                                     className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
//                                 >
//                                     Logout
//                                 </button>
//                             )}
//                         </nav>
//                     </div>
//                 </div>
//             </>
//         );

//         // Navbar Component
//         const Navbar = () => (
//             <nav className={`fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 transition-all duration-500 ease-out ${
//                 navbarVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
//             }`}>
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex justify-between items-center h-16">
//                         {/* Left side - Menu button (only if authenticated) */}
//                         <div className="flex items-center">
//                             {!isAuthenticated ? (
//                                 <button
//                                     onClick={toggleSideDrawer}
//                                     className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
//                                 >
//                                     <Menu className="w-6 h-6 text-slate-700" />
//                                 </button>
//                             ) : (
//                                 <div className="w-10 h-10" /> // Placeholder to maintain layout
//                             )}
//                         </div>

//                         {/* Center - Logo */}
//                         <div className="flex-1 flex justify-center">
//                             <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 via-green-500 to-blue-600 bg-clip-text text-transparent">
//                                 Tvara
//                             </h1>
//                         </div>

//                         {/* Right side - Auth buttons or user avatar */}
//                         <div className="flex items-center space-x-3">
//                             {isAuthenticated ? (
//                                 <div className="flex items-center space-x-2">
//                                     <span className="text-sm text-slate-600 hidden sm:block">
//                                         {userInfo?.name}
//                                     </span>
//                                     <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition-shadow duration-200">
//                                         {getUserInitial()}
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="flex items-center space-x-2">
//                                     <button
//                                         onClick={() => navigate("/log-in")}
//                                         className="flex items-center space-x-1 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200"
//                                     >
//                                         <LogIn className="w-4 h-4" />
//                                         <span className="hidden sm:block">Login</span>
//                                     </button>
//                                     <button
//                                         onClick={() => navigate("/create-account")}
//                                         className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
//                                     >
//                                         <UserPlus className="w-4 h-4" />
//                                         <span className="hidden sm:block">Sign up</span>
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </nav>
//         );

//         if (showModal) {
//             return (
//                 <>
//                     <div
//                         className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ease-out ${
//                             isVisible
//                                 ? 'bg-slate-300/70 backdrop-blur-sm'
//                                 : 'bg-slate-300/0 backdrop-blur-none'
//                         }`}
//                     >
//                         <div
//                             className={`relative w-full max-w-md transform transition-all duration-500 ease-out ${
//                                 isVisible
//                                     ? 'scale-100 opacity-100 translate-y-0'
//                                     : 'scale-90 opacity-0 translate-y-8'
//                             }`}
//                             onClick={e => e.stopPropagation()}
//                         >
//                             <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 relative">
//                                 <div className="px-8 pt-10 pb-4 text-center">
//                                     <h2 className="text-2xl font-bold text-slate-800 mb-2">
//                                         Welcome to{" "}
//                                         <span className="text-xl font-bold bg-gradient-to-r from-orange-500 via-green-500 to-blue-600 bg-clip-text text-transparent">
//                                             Tvara
//                                         </span>
//                                     </h2>
//                                     <p className="text-slate-600 leading-relaxed">
//                                         Great choice! Experience{" "}
//                                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-600 font-semibold">
//                                             intelligent conversations
//                                         </span>{" "}
//                                         crafted for you
//                                     </p>
//                                 </div>

//                                 <div className="px-8 pb-8 space-y-4 mt-6">
//                                     <button
//                                         onClick={() => handleAuthChoice('login')}
//                                         className="w-full group relative overflow-hidden bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-500 text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] shadow-md"
//                                     >
//                                         <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
//                                         <div className="relative">
//                                             <span className="text-lg">Log in</span>
//                                         </div>
//                                     </button>

//                                     <button
//                                         onClick={() => handleAuthChoice('signup')}
//                                         className="w-full group relative overflow-hidden border-2 border-green-500 text-green-600 hover:from-blue-600 hover:to-blue-700 font-semibold py-4 px-6 rounded-full transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] shadow-sm"
//                                     >
//                                         <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
//                                         <div className="relative">
//                                             <span className="text-lg">Signup for free</span>
//                                         </div>
//                                     </button>

//                                     <div className="relative mb-6">
//                                         <div className="absolute inset-0 flex items-center">
//                                             <div className="w-full border-t border-slate-200"></div>
//                                         </div>
//                                         <div className="relative flex justify-center text-sm">
//                                             <span className="px-4 bg-white text-slate-400 font-medium">
//                                                 or
//                                             </span>
//                                         </div>
//                                     </div>

//                                     <button
//                                         onClick={() => handleAuthChoice('guest')}
//                                         className="w-full group relative overflow-hidden bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-3 px-6 rounded-full transition-all duration-200 border border-slate-200 hover:border-slate-300"
//                                     >
//                                         <div className="absolute inset-0 bg-slate-300/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
//                                         <div className="relative">
//                                             <span>Continue as Guest</span>
//                                         </div>
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="opacity-0 pointer-events-none">
//                         <WrappedComponent {...props} />
//                     </div>
//                 </>
//             );
//         }

//         return (
//             <>
//                 <Navbar />
//                 <SideDrawer />
//                 <div className={`transition-all duration-500 ease-out ${
//                     navbarVisible ? 'pt-16' : 'pt-0'
//                 } ${sideDrawerOpen && isAuthenticated ? 'lg:ml-0' : ''}`}>
//                     <WrappedComponent {...props} />
//                 </div>
//             </>
//         );
//     };
// };

// export default withAuthModal;