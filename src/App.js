import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Auth/Login';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import "../src/styles/global.css";
import InstructorDashboard from './components/InstructorDashboard/InstructorDashboard';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute role="student"><Dashboard /></ProtectedRoute>}
          />

          <Route
            path="/instructor/dashboard"
            element={<ProtectedRoute role="instructor"><InstructorDashboard /></ProtectedRoute>}
          />

          {/* <Route path='/instructor/dashboard' element={InstructorDashboard} /> */}
        </Routes>
      </Router>
    </AuthProvider >
  );
}

export default App;
