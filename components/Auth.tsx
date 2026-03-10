import React, { createContext, useState, useContext, ReactNode, FC, useEffect } from 'react';

// NOTE: This is a mock authentication system.
// In a real application, you would replace the localStorage logic
// with API calls to a secure backend service.

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User>;
  logout: () => void;
  register: (name: string, email: string, pass: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_STORAGE_KEY = 'kraken_users';
const SESSION_STORAGE_KEY = 'kraken_session';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const session = window.localStorage.getItem(SESSION_STORAGE_KEY);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error parsing session from localStorage', error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving session to localStorage', error);
    }
  }, [user]);

  const getUsers = () => {
    try {
      const users = window.localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : {};
    } catch (error) {
      console.error('Error getting users from localStorage', error);
      return {};
    }
  };

  const saveUsers = (users: any) => {
     try {
      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage', error);
    }
  };

  const login = (email: string, pass: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate network delay
        const users = getUsers();
        if (users[email] && users[email].password === pass) {
          const loggedInUser = { name: users[email].name, email };
          setUser(loggedInUser);
          resolve(loggedInUser);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };

  const register = (name: string, email: string, pass: string): Promise<User> => {
     return new Promise((resolve, reject) => {
       setTimeout(() => { // Simulate network delay
        const users = getUsers();
        if (users[email]) {
          reject(new Error('User with this email already exists'));
        } else {
          users[email] = { name, password: pass };
          saveUsers(users);
          const newUser = { name, email };
          setUser(newUser);
          resolve(newUser);
        }
       }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
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