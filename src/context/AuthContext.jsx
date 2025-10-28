import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@config/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Validate email domain
  const validateEmailDomain = (email) => {
    return email.endsWith('@unimelb.edu.au') || email.endsWith('@student.unimelb.edu.au');
  };

  // Sign up with email (simplified - no email verification for now)
  const signUp = async (email, password, fullName) => {
    try {
      if (!validateEmailDomain(email)) {
        throw new Error('Please use your University of Melbourne email address.');
      }

      // Create user account directly with Supabase Auth
      // emailRedirectTo: null prevents confirmation email
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: undefined
        }
      });

      if (signUpError) throw signUpError;

      // If email confirmation is required by Supabase, show a better message
      if (data?.user && !data.session) {
        throw new Error('Please check your email to confirm your account, then sign in.');
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: email,
            full_name: fullName,
            verification_status: true
          }
        ]);

      if (profileError) throw profileError;

      return { data, error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error };
    }
  };

  // Verify email code
  const verifyCode = async (code) => {
    try {
      const pendingSignup = JSON.parse(localStorage.getItem('pendingSignup'));
      if (!pendingSignup) {
        throw new Error('No pending signup found.');
      }

      // Verify code
      const { data: codes, error: codeError } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('email', pendingSignup.email)
        .eq('code', code)
        .gt('expires_at', new Date().toISOString())
        .eq('used', false)
        .single();

      if (codeError || !codes) {
        // Increment failed attempts
        await supabase.rpc('increment_failed_attempts', {
          email_address: pendingSignup.email
        });
        throw new Error('Invalid or expired code.');
      }

      // Mark code as used
      await supabase
        .from('verification_codes')
        .update({ used: true })
        .eq('id', codes.id);

      // Create user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: pendingSignup.email,
        password: pendingSignup.password,
        options: {
          data: {
            full_name: pendingSignup.fullName
          }
        }
      });

      if (signUpError) throw signUpError;

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: pendingSignup.email,
            full_name: pendingSignup.fullName,
            verification_status: true
          }
        ]);

      if (profileError) throw profileError;

      // Clear pending signup
      localStorage.removeItem('pendingSignup');
      setVerificationSent(false);

      return { data, error: null };
    } catch (error) {
      console.error('Error in verifyCode:', error);
      return { error };
    }
  };

  // Sign in with email
  const signIn = async (email, password) => {
    try {
      if (!validateEmailDomain(email)) {
        throw new Error('Please use your University of Melbourne email address.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error in signOut:', error);
      return { error };
    }
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return { error };
    }
  };

  const value = {
    user,
    loading,
    verificationSent,
    signUp,
    verifyCode,
    signIn,
    signOut,
    getUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
