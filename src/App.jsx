import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header, Footer } from '@components/layout';
import {
  SignIn,
  SignUp,
  Discover,
  Create,
  MyGroups,
  Profile,
} from '@pages';
import { AuthProvider, useAuth } from '@context/AuthContext';

// Redirect to sign in if not authenticated
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" />;
};

// Redirect to discover if already authenticated
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/discover" />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {user && <Header />}
      <main className="flex-1">
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/discover"
            element={
              <PrivateRoute>
                <Discover />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <Create />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-groups"
            element={
              <PrivateRoute>
                <MyGroups />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Redirect root to appropriate page */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/discover" />
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
        </Routes>
      </main>
      {user && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;