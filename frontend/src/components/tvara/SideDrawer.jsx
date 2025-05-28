const SideDrawer = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Sidebar */}
            <div className={`fixed left-0 top-16 bottom-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h3>
                    <nav className="space-y-2">
                        <a href="#" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                            Dashboard
                        </a>
                        <a href="#" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                            Conversations
                        </a>
                        <a href="#" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                            Settings
                        </a>
                        <a href="#" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                            Help & Support
                        </a>
                    </nav>
                </div>
            </div>

            {/* Sidebar Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
                    onClick={onClose}
                />
            )}
        </>
    );
};

export default SideDrawer;