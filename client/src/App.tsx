import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import LoginSelection from './pages/auth/LoginSelection';
import FacultyLogin from './pages/auth/FacultyLogin';
import StudentLogin from './pages/auth/StudentLogin';
import FacultyRouter from './pages/faculty/FacultyRouter';
import StudentDashboard from './pages/StudentDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginSelection />} />
            <Route path="/login/faculty" element={<FacultyLogin />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/faculty/*" element={<FacultyRouter />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
