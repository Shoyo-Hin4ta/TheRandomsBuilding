import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, UtensilsCrossed, Notebook, LineChart, FileText, PieChart } from 'lucide-react';
import { clearUser } from '../../store/slice/userSlice';
import axios from 'axios';

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);
  const accessToken = useSelector(state => state.user.accessToken);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      dispatch(clearUser());
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(clearUser());
      navigate('/signin');
    }
  };

  const menu = [
    { name: 'Meal Logging', path: '/meal-logging', icon: UtensilsCrossed },
    { name: 'Dashboard', path: '/dashboard', icon: LineChart },
    { name: 'Analysis', path: '/analysis', icon: PieChart },
    { name: 'Recipes', path: '/recipe-generation', icon: Notebook },
    { name: 'Reports', path: '/generate-report', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NutriTrack
            </h1>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-700 font-medium">
                    {currentUser?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium">Hey, {currentUser?.username}</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="hover:bg-red-50 text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-7xl mx-auto px-4 w-full py-6">
        {children}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
        <nav className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-5 h-16 items-center w-full">
            {menu.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center justify-center w-full gap-1 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'text-emerald-600 bg-emerald-50' 
                      : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AuthLayout;