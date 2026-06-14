import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './presentation/hooks/AuthContext';
import { CalendarPage } from './presentation/pages/CalendarPage';
import { LoginPage } from './presentation/pages/LoginPage';
import { RoleSelectPage } from './presentation/pages/RoleSelectPage';
import { StudentManagePage } from './presentation/pages/StudentManagePage';
import { HomeworkPage } from './presentation/pages/HomeworkPage';
import { AnnouncementsPage } from './presentation/pages/AnnouncementsPage';
import { BottomNav } from './presentation/components/BottomNav';

function AppRoutes() {
  const { authState } = useAuth();

  if (authState.status === 'loading') {
    return <div className="app-loading" aria-label="로딩 중" />;
  }

  if (authState.status === 'unauthenticated') {
    return <LoginPage onNewUser={() => {}} />;
  }

  if (authState.status === 'needs-role') {
    return <RoleSelectPage firebaseUser={authState.firebaseUser} />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<CalendarPage />} />
        <Route
          path="/students"
          element={
            authState.user.role === 'teacher'
              ? <StudentManagePage />
              : <Navigate to="/" replace />
          }
        />
        <Route path="/homework" element={<HomeworkPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
