import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Input, Button } from '@components/ui';
import { useAuth } from '@context/AuthContext';

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);
      if (error) throw error;
      
      setSuccess(true);
      // Redirect to discover page after successful signup
      setTimeout(() => {
        navigate('/discover');
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold mb-4">Welcome to Joynex!</h1>
            <p className="text-gray-600">
              Your account has been created successfully. Redirecting you to discover groups...
            </p>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Join Joynex
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Connect with fellow University of Melbourne students
        </p>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSignUp} className="space-y-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            disabled={loading}
            required
          />
          <Input
            label="University Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.name@student.unimelb.edu.au"
            disabled={loading}
            required
          />
          <p className="text-sm text-gray-500">
            Only @unimelb.edu.au or @student.unimelb.edu.au emails are accepted
          </p>
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a secure password"
            disabled={loading}
            required
          />
          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Sign Up
          </Button>
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign In
            </Link>
          </p>
        </form>
      </Card>
    </Container>
  );
};

export default SignUp;
