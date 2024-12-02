// components/layout/AuthLayout.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, User } from 'lucide-react';
import { clearUser } from '../../store/slice/userSlice';
import axios from 'axios';

const AuthLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser);
  
    const handleLogout = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/users/logout`,
          {},
          { withCredentials: true }
        );
  
        if (response.data.success) {
          dispatch(clearUser());
          navigate('/signin');
        }
      } catch (error) {
        console.error('Logout failed:', error);
        alert('Failed to logout. Please try again.');
      }
    };
  
    const menu = [
      { name: 'Meal Logging', path: '/meal-logging' },
      { name: 'Recipe Generation', path: '/recipe-generation' },
      { name: 'Dashboard', path: '/dashboard' }
    ];
  
    return (
        <div className="min-h-screen bg-white flex flex-col">
          {/* Top Header with User Menu */}
          <div className="flex justify-end p-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 hover:text-gray-600">
                <span className="font-medium">Hey, {currentUser?.username}</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
    
          {/* Main Content */}
          <div className="flex-1 flex flex-col pb-32"> {/* Space for both date selector and nav */}
            {children}
          </div>
    
          {/* Navigation Menu at the bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-white z-10"> {/* Removed bottom-20 */}
            <nav className="border-t border-gray-200">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-center space-x-8 h-16 items-center">
                  {menu.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`px-3 py-2 text-sm font-medium
                        ${location.pathname === item.path
                          ? 'text-green-600'
                          : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      );
    };
    
    export default AuthLayout;