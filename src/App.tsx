import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Grades from './components/Grades';
import Subjects from './components/Subjects';
import Tasks from './components/Tasks';
import StudyTips from './components/StudyTips';
import About from './components/About';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  switch (currentScreen) {
    case 'grades':
      return <Grades onBack={() => setCurrentScreen('dashboard')} />;
    case 'subjects':
      return <Subjects onBack={() => setCurrentScreen('dashboard')} />;
    case 'tasks':
      return <Tasks onBack={() => setCurrentScreen('dashboard')} />;
    case 'tips':
      return <StudyTips onBack={() => setCurrentScreen('dashboard')} />;
    case 'about':
      return <About onBack={() => setCurrentScreen('dashboard')} />;
    default:
      return <Dashboard onNavigate={setCurrentScreen} />;
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
