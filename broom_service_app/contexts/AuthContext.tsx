import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { createUser, UserType } from '../utils/userQueries';
import { Alert } from 'react-native';

type AuthContextType = {
  session: Session | null;
  user: User | null;  // Add user to context
  loading: boolean;
  signOut: () => Promise<void>;  // Add signOut function
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},  // Default empty function
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error; // Re-throw to handle in the component if needed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
        }

        // Handle user creation in DynamoDB after email verification
        if (event === 'USER_UPDATED' || event === 'SIGNED_IN') {
          if (session?.user?.email_confirmed_at && !session.user.user_metadata?.dynamodb_created) {
            try {
              const userData: UserType = {
                id: session.user.id,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                family_id: 'default-family-id',
                email: session.user.email || undefined,
                is_admin: session.user.user_metadata?.is_admin || false
              };

              console.log('Creating user in DynamoDB:', userData);
              await createUser(userData);

              // Mark user as processed in Supabase
              await supabase.auth.updateUser({
                data: { 
                  ...session.user.user_metadata,
                  dynamodb_created: true 
                }
              });

              console.log('User created in DynamoDB and marked as processed');
            } catch (error) {
              console.error('Error creating user in DynamoDB:', error);
              // Don't show error to user here as it might be confusing
              // The error is already logged to the console for debugging
            }
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};