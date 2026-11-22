import React, { createContext, useState, useContext, ReactNode, FC, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './firebase';

interface User {
  name: string;
  email: string;
  uid?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let resolved = false;

    // Safety timeout to prevent a blank screen if Firebase Auth takes too long or fails to respond
    const safetyTimeout = setTimeout(() => {
      if (!resolved) {
        console.warn('Firebase auth state loading timed out. Rendering app in guest/offline mode.');
        setLoading(false);
      }
    }, 2500);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      resolved = true;
      clearTimeout(safetyTimeout);
      
      if (firebaseUser && !firebaseUser.isAnonymous) {
        setUser({
          name: firebaseUser.displayName || firebaseUser.email || 'Client',
          email: firebaseUser.email || '',
          uid: firebaseUser.uid
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const fbUser = userCredential.user;
      const loggedInUser: User = {
        name: fbUser.displayName || fbUser.email || 'Client',
        email: fbUser.email || '',
        uid: fbUser.uid
      };
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err: any) {
      if (email.toLowerCase().trim() === 'kai@krakenpfm.ch') {
        try {
          // If login fails, try on-the-fly registration with password for Kai
          return await register("Kai (Staff Admin)", email, pass);
        } catch (regErr) {
          throw err;
        }
      }
      throw err;
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const fbUser = userCredential.user;
    
    // Persist display name to Firebase Auth profile
    await updateProfile(fbUser, { displayName: name });
    
    const newUser: User = {
      name: name,
      email: fbUser.email || '',
      uid: fbUser.uid
    };
    setUser(newUser);
    return newUser;
  };

  const loginWithGoogle = async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const fbUser = userCredential.user;
    const loggedInUser: User = {
      name: fbUser.displayName || fbUser.email || 'Client',
      email: fbUser.email || '',
      uid: fbUser.uid
    };
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};