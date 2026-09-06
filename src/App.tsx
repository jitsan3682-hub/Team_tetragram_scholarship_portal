import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminAccess from './pages/admin/AdminAccess';
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import MyScholarships from './pages/student/MyScholarships';
import Applications from './pages/student/Applications';
import DocumentLocker from './pages/student/DocumentLocker';
import SopLorManager from './pages/student/SopLorManager';
import AdminDashboard from './pages/admin/Dashboard';
import Resources from './pages/Resources';
import LandingPage from './pages/LandingPage';

const ProtectedRoute = ({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole?: 'student' | 'admin';
}) => {
  const { user, activeRole } = useAuth();
  const savedRole = typeof window !== 'undefined' ? localStorage.getItem('scholarbridge_active_role') : null;

  if (allowedRole === 'admin') {
    const isAdmin = user?.role === 'admin' || activeRole === 'admin' || savedRole === 'admin';
    if (!isAdmin) {
      return <Navigate to="/admin-access" replace />;
    }
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <div className="antialiased text-stone-900 dark:text-stone-100 min-h-screen">
              <Router>
                <Routes>
                  {/* Public Landing & Auth Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/home" element={<LandingPage />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin-access" element={<AdminAccess />} />

                  {/* Main Portal App Layout */}
                  <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<StudentDashboard />} />
                    <Route path="/my-scholarships" element={<MyScholarships />} />
                    <Route path="/saved" element={<Navigate to="/my-scholarships" replace />} />
                    <Route path="/applications" element={<Applications />} />
                    <Route path="/document-locker" element={<DocumentLocker />} />
                    <Route path="/sop-lor" element={<SopLorManager />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/profile" element={<StudentProfile />} />

                    {/* Admin Route */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute allowedRole="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* Catch-all */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Router>
            </div>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
