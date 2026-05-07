import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { UsersIcon, BuildingOfficeIcon, DocumentTextIcon, FlagIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersRes, clubsRes, opportunitiesRes, reportsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/admin/users`),
        axios.get(`${process.env.REACT_APP_API_URL}/admin/clubs`),
        axios.get(`${process.env.REACT_APP_API_URL}/opportunities/feed?limit=1000`),
        axios.get(`${process.env.REACT_APP_API_URL}/admin/reports`)
      ]);

      return {
        users: usersRes.data.length,
        clubs: clubsRes.data.length,
        opportunities: opportunitiesRes.data.length,
        reports: reportsRes.data.length
      };
    }
  });

  const statCards = [
    {
      name: 'Total Users',
      value: stats?.users || 0,
      icon: UsersIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Clubs',
      value: stats?.clubs || 0,
      icon: BuildingOfficeIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Opportunities',
      value: stats?.opportunities || 0,
      icon: DocumentTextIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Reports',
      value: stats?.reports || 0,
      icon: FlagIcon,
      color: 'bg-red-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your university hub</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-600">New user registered</span>
              <span className="ml-auto text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Opportunity approved</span>
              <span className="ml-auto text-gray-400">4 hours ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Report submitted</span>
              <span className="ml-auto text-gray-400">6 hours ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <UsersIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-900">Manage Users</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-900">Review Clubs</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <FlagIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-900">Handle Reports</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;