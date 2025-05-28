import React, { useState } from 'react';
import TvaraNavbar from './TvaraNavbar';
import SideDrawer from './SideDrawer';

const Layout = ({ 
    children, 
    isAuthenticated, 
    userInfo, 
    onLogout 
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TvaraNavbar
                isAuthenticated={isAuthenticated}
                userInfo={userInfo}
                sidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
                onLogout={onLogout}
            />

            <SideDrawer
                isOpen={sidebarOpen}
                onClose={closeSidebar}
            />

            {/* Main Content */}
            <div className={`transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'md:ml-64' : 'ml-0'
            }`}>
                {children}
            </div>
        </div>
    );
};

export default Layout;