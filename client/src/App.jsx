import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { useLocation } from 'react-router-dom';

const HIDE_NAV = ['/login', '/register'];

function Layout() {
  const location = useLocation();
  const hideNav = HIDE_NAV.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      {!hideNav && <Navbar />}
      <main className={`flex-1 ${!hideNav ? 'pt-16 pb-20 lg:pb-0' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}
