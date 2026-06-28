import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Pages
import LandingPage from './pages/Landing/LandingPage';
import AchievementsGallery from './pages/Landing/AchievementsGallery';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StudentDashboard from './pages/Admin/StudentDashboard';
import TeacherDashboard from './pages/Admin/TeacherDashboard';
import EnquiryPage from './pages/Landing/EnquiryPage';
import StudentLogin from './pages/Student/StudentLogin';
import StudyMaterialPage from './pages/Landing/StudyMaterialPage';
import NotesDashboard from './pages/Student/NotesDashboard';
import CourseDetailPage from './pages/Landing/CourseDetailPage';


// Protected Route Guard Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-bgLight flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!token) {
    // Redirect to student login if attempting to access student dashboard
    if (location.pathname.startsWith('/student')) {
      return <Navigate to="/student/login" replace />;
    }
    // Redirect to admin login for other routes
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    if (user.role === 'student') {
      return <Navigate to={user.studentType === 'NotesOnly' ? "/student/notes-dashboard" : "/student/dashboard"} replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Redirection guard for different student types
  if (user && user.role === 'student') {
    if (user.studentType === 'NotesOnly' && location.pathname === '/student/dashboard') {
      return <Navigate to="/student/notes-dashboard" replace />;
    }
    if (user.studentType !== 'NotesOnly' && location.pathname === '/student/notes-dashboard') {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/achievements" element={<AchievementsGallery />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/enquiry" element={<EnquiryPage />} />
            <Route path="/study-material" element={<StudyMaterialPage />} />
            <Route path="/course/:courseName" element={<CourseDetailPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/notes-dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <NotesDashboard />
                </ProtectedRoute>
              }
            />



            {/* Protected Teacher Routes */}
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
