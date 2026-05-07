import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  FlagIcon,
  NoSymbolIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Building2, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  const adminMenuItems = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Clubs', href: '/admin/clubs', icon: BuildingOfficeIcon },
    { name: 'Moderation', href: '/admin/moderation', icon: ShieldCheckIcon },
    { name: 'Reports', href: '/admin/reports', icon: FlagIcon },
    { name: 'Blacklist', href: '/admin/blacklist', icon: NoSymbolIcon },
  ];

  const clubMenuItems = [
    { name: 'Dashboard', href: '/club', icon: HomeIcon },
    { name: 'My Opportunities', href: '/club/opportunities', icon: DocumentTextIcon },
    { name: 'Create Opportunity', href: '/club/create', icon: PlusIcon },
  ];

  const menuItems = isAdmin ? adminMenuItems : clubMenuItems;

  return (
    <div className="bg-white shadow-lg w-64">
      <div className="flex items-center justify-center h-16 bg-blue-600">
        <Building2 className="h-8 w-8 text-white" />
        <span className="ml-2 text-white font-bold text-lg">UniHub</span>
      </div>

      <nav className="mt-8">
        <div className="px-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {isAdmin ? 'Admin Panel' : 'Club Panel'}
          </p>
        </div>

        <div className="mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 px-4">
          <button
            onClick={logout}
            className="flex items-center w-full px-2 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;