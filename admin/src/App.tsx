import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminDashboard from './pages/AdminDashboard.tsx';
import ClubDashboard from './pages/ClubDashboard.tsx';
import Login from './pages/Login.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route
        path="/admin/*"
        element={user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/club" />}
      />
      <Route
        path="/club/*"
        element={user.role === 'club_leader' ? <ClubDashboard /> : <Navigate to="/admin" />}
      />
      <Route
        path="*"
        element={<Navigate to={user.role === 'admin' ? '/admin' : '/club'} />}
      />
    </Routes>
  );
}

export default App;