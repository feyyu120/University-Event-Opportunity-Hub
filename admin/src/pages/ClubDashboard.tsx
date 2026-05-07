import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar.tsx';
import Header from '../components/Header.tsx';
import Dashboard from '../components/club/Dashboard.tsx';
import Opportunities from '../components/club/Opportunities.tsx';
import CreateOpportunity from '../components/club/CreateOpportunity.tsx';

const ClubDashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="create" element={<CreateOpportunity />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ClubDashboardPage;