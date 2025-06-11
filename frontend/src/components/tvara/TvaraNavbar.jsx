import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import BrandLogo from '../elements/BrandLogo';
import ProfileDropdown from '../profile/ProfileDropdown';
import axios from 'axios';

const TvaraNavbar = ({
    isAuthenticated,
    sidebarOpen,
    onToggleSidebar,
    onLogout
}) => {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getProfileData(token);
        }
    }, []);

    const getProfileData = async (token) => {
        try {
            const response = await axios.get('http://localhost:8000/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Profile Error:', error);
            localStorage.removeItem('token');
            setUserData(null);
        }
    };

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showProfileDropdown && !event.target.closest('.profile-dropdown-container')) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showProfileDropdown]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 ">
            {/* bg-white/80 backdrop-blur-md border-b border-gray-200/50 */}
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side - Menu toggle */}
                    {/* <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                        {sidebarOpen ? (
                            <X className="w-6 h-6 text-gray-600" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-600" />
                        )}
                    </button> */}

                    {/* Center - Logo/Brand */}
                    <div className="flex-1 flex justify-begin ml-4">
                        <BrandLogo>
                            Tvara
                        </BrandLogo>
                    </div>

                    <div className="flex items-center space-x-3">
                        {isAuthenticated ? (
                            <div className="relative profile-dropdown-container">
                                <button
                                    onClick={toggleProfileDropdown}
                                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                </button>

                                {/* Profile Dropdown */}
                                {(showProfileDropdown && isAuthenticated) && (
                                    <ProfileDropdown onLogout = {onLogout} setShowProfileDropdown={setShowProfileDropdown} userData={userData}/>
                                )}
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors duration-200"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate("/register")}
                                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600 transition-all duration-200"
                                >
                                    Signup
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default TvaraNavbar;