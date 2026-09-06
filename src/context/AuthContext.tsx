import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';
import { supabase } from '../lib/supabase';

export const LOCAL_USER_KEY = 'auth_current_user_v1';
export const ACTIVE_ROLE_KEY = 'scholarbridge_active_role';

interface AuthContextType {
  user: User | null;
  activeRole: 'student' | 'admin';
  setRole: (role: 'student' | 'admin') => void;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, password?: string, name?: string, role?: string) => Promise<void>;
  updateProfile: (updated: Partial<User>) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<'student' | 'admin'>(() => {
    try {
      const savedRole = localStorage.getItem(ACTIVE_ROLE_KEY);
      if (savedRole === 'admin' || savedRole === 'student') return savedRole;
    } catch (e) {
      console.error('Failed to read active role from localStorage', e);
    }
    return 'student';
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedRole = localStorage.getItem(ACTIVE_ROLE_KEY);
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (savedRole === 'admin') {
          if (parsed && parsed.role === 'admin') return parsed;
          return mockUsers.find((u) => u.role === 'admin') || parsed;
        } else if (savedRole === 'student') {
          if (parsed && parsed.role === 'student') return parsed;
          return mockUsers[0];
        }
        return parsed;
      }
      if (savedRole === 'admin') {
        return mockUsers.find((u) => u.role === 'admin') || mockUsers[0];
      }
    } catch (e) {
      console.error('Failed to parse local user', e);
    }
    // Default demo student if first visit
    return mockUsers[0];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
      const role = user.role === 'admin' ? 'admin' : 'student';
      setActiveRoleState(role);
      localStorage.setItem(ACTIVE_ROLE_KEY, role);
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  }, [user]);

  const setRole = (role: 'student' | 'admin') => {
    setActiveRoleState(role);
    try {
      localStorage.setItem(ACTIVE_ROLE_KEY, role);
    } catch (e) {
      console.error('Failed to persist active role', e);
    }

    if (role === 'admin') {
      const adminUser = mockUsers.find((u) => u.role === 'admin') || {
        id: 'a1',
        name: 'Prof. Hemanta Sharma (Admin)',
        email: 'admin@tezhack.in',
        role: 'admin' as const,
      };
      setUser(adminUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(adminUser));
    } else {
      const studentUser = mockUsers[0];
      setUser(studentUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(studentUser));
    }
  };

  const login = async (email: string, password?: string) => {
    // Check mock users first for smooth hackathon demo
    const foundMock = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || (email.includes('admin') && u.role === 'admin')
    );

    if (foundMock) {
      setUser(foundMock);
      const role = foundMock.role === 'admin' ? 'admin' : 'student';
      setActiveRoleState(role);
      localStorage.setItem(ACTIVE_ROLE_KEY, role);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(foundMock));
      return;
    }

    try {
      if (!password) password = 'password123';
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.user) {
        const uRole = (data.user.user_metadata?.role as any) === 'admin' ? 'admin' : 'student';
        const userData: User = {
          id: data.user.id,
          name: data.user.user_metadata?.name || email.split('@')[0],
          email: data.user.email!,
          role: uRole,
          state: 'Assam',
          major: 'Computer Science',
          gpa: 3.4,
          familyIncome: 320000,
          category: 'General',
        };
        setUser(userData);
        setActiveRoleState(uRole);
        localStorage.setItem(ACTIVE_ROLE_KEY, uRole);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));
        return;
      }
    } catch (e) {
      console.warn('Supabase auth fallback to local user generation', e);
    }

    // Dynamic guest/new student or admin user
    const dynamicRole = email.includes('admin') ? 'admin' : 'student';
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: dynamicRole,
      state: 'Assam',
      major: 'Computer Science',
      academicLevel: 'Undergraduate',
      gpa: 3.4,
      familyIncome: 320000,
      category: 'General',
      gender: 'Male',
    };
    setUser(newUser);
    setActiveRoleState(dynamicRole);
    localStorage.setItem(ACTIVE_ROLE_KEY, dynamicRole);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
  };

  const register = async (email: string, password?: string, name?: string, role?: string) => {
    const determinedRole = (role as any) === 'admin' ? 'admin' : 'student';
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      role: determinedRole,
      state: 'Assam',
      major: 'Computer Science',
      academicLevel: 'Undergraduate',
      gpa: 3.2,
      familyIncome: 300000,
      category: 'General',
      gender: 'Male',
    };
    setUser(newUser);
    setActiveRoleState(determinedRole);
    localStorage.setItem(ACTIVE_ROLE_KEY, determinedRole);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
  };

  const updateProfile = (updated: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updated };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Supabase sign-out encountered an error or network interruption:', error);
    }
    setUser(null);
    setActiveRoleState('student');
    localStorage.removeItem(LOCAL_USER_KEY);
    localStorage.setItem(ACTIVE_ROLE_KEY, 'student');
  };

  return (
    <AuthContext.Provider value={{ user, activeRole, setRole, login, register, updateProfile, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
