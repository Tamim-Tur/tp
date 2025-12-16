import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateAd from './pages/CreateAd';
import Payment from './pages/Payment';
import Messages from './pages/Messages';
import Account from './pages/Account';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <div className="layout-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-ad" element={
            <PrivateRoute>
              <CreateAd />
            </PrivateRoute>
          } />
          <Route path="/payment/:adId" element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          } />
          <Route path="/messages" element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
          } />
          <Route path="/messages/:adId/:userId" element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
          } />
          <Route path="/account" element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          } />
        </Routes>
      </div>
      <Footer />
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
