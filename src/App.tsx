import './App.css';
import { AuthProvider, useAuth } from './presentation/hooks/AuthContext';
import { CalendarPage } from './presentation/pages/CalendarPage';
import { LoginPage } from './presentation/pages/LoginPage';
import { RoleSelectPage } from './presentation/pages/RoleSelectPage';

function AppRoutes() {
  const { authState } = useAuth();

  if (authState.status === 'loading') {
    return <div className="app-loading" aria-label="로딩 중" />;
  }

  if (authState.status === 'unauthenticated') {
    return (
      <LoginPage
        onNewUser={() => {
          // onAuthStateChanged가 needs-role 상태로 전환시켜 줌
        }}
      />
    );
  }

  if (authState.status === 'needs-role') {
    return <RoleSelectPage firebaseUser={authState.firebaseUser} />;
  }

  return <CalendarPage />;
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
