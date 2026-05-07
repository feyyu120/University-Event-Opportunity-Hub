import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar.tsx';
import Header from '../components/Header.tsx';
import Dashboard from '../components/admin/Dashboard.tsx';
import Users from '../components/admin/Users.tsx';
import Clubs from '../components/admin/Clubs.tsx';
import Moderation from '../components/admin/Moderation.tsx';
import Reports from '../components/admin/Reports.tsx';
import Blacklist from '../components/admin/Blacklist.tsx';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="clubs" element={<Clubs />} />
            <Route path="moderation" element={<Moderation />} />
            <Route path="reports" element={<Reports />} />
            <Route path="blacklist" element={<Blacklist />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;