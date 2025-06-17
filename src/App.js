import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Auth/Login';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import "../src/styles/global.css";
import InstructorDashboard from './components/InstructorDashboard/InstructorDashboard';
import NotFound from './NotFound';
function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/instructor/dashboard"
            element={<ProtectedRoute role="instructor"><InstructorDashboard /></ProtectedRoute>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider >
  );
}

export default App;
