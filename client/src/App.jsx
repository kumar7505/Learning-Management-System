import { Routes ,Route } from 'react-router-dom';
import { Button } from './components/ui/button';
import AuthPage from './pages/auth';
import RouteGuard from './components/route-guard';
import InstructorDashboardPage from './pages/instructor';
import StudentViewCommonLayout from './components/student-view/common-layout';
import StudentHomePage from './pages/student/home';
import { useContext } from 'react';
import { AuthContext } from './context/auth-context';
function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      <Route
        path="/"
        element={
          <RouteGuard
            element={<StudentViewCommonLayout />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      <Route path="" element={<StudentHomePage />} />
      <Route path="home" element={<StudentHomePage />} />

    </Routes>
  );
};

export default App;
