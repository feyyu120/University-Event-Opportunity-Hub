import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.full_name}
          </h1>
          <p className="text-sm text-gray-500">
            {user?.role === 'admin' ? 'Administrator Dashboard' : 'Club Leader Dashboard'}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <BellIcon className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-2">
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user?.full_name}</p>
              <p className="text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;