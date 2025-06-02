import { LogOut } from 'lucide-react';
import { useState , useEffect} from 'react';
import axios from 'axios';

const ProfileDropdown = ({setShowProfileDropdown,onLogout}) => {
    const [userData, setUserData] = useState(null);

    const getProfileData = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const response = await axios.get('http://localhost:8000/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const userdetailExist = response.data;

                if (userdetailExist) {
                    setUserData(userdetailExist);
                }
            } catch (error) {
                console.error('Profile Error:', error);
            }
        }
    };

    useEffect(() => {
            getProfileData();
    }, [])

        const handleLogout = () => {
        setShowProfileDropdown(false);
        onLogout();
    };


    return (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                    {userData && userData.username}

                </p>
                <p className="text-sm text-gray-500">
                    {userData && userData.email}
                </p>
            </div>
            <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
            </button>
        </div>
    )
}

export default ProfileDropdown;