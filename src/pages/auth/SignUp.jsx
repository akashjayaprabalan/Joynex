import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Input, Button } from '@components/ui';
import { useAuth } from '@context/AuthContext';

const SignUp = () => {
  const { signUp, verifyCode, verificationSent } = useAuth();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);
      if (error) throw error;
      setResendTimer(120); // 2 minutes
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await verifyCode(verificationCode);
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);
      if (error) throw error;
      setResendTimer(120); // 2 minutes
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Verify Your Email
          </h1>
          <p className="text-gray-600 text-center mb-6">
            A 6-digit code has been sent to your email. Please enter it below to complete your registration.
          </p>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleVerify} className="space-y-4">
            <Input
              label="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              disabled={loading}
              required
            />
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Verify Email
            </Button>
            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-gray-600">
                  Resend code in {Math.floor(resendTimer / 60)}:
                  {(resendTimer % 60).toString().padStart(2, '0')}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-blue-600 hover:text-blue-800"
                  disabled={loading}
                >
                  Resend Code
                </button>
              )}
            </div>
          </form>
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
