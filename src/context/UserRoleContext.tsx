import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../lib/axios';

type UserRole = "visitor" | "cc" | "member" | "admin";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

interface UserRoleContextType {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  roleLoading: boolean;
  setRole: (role: UserRole) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

interface UserRoleProviderProps {
  children: ReactNode;
}

const convertToUserRole = (role: string | undefined | null): UserRole => {
  if (role === 'cc' || role === 'member' || role === 'admin') {
    return role;
  }
  return 'member';
};

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("visitor");
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUserState(parsedUser);
        setUserRole(convertToUserRole(parsedUser.role));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
    setLoading(false);
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setUserRole(convertToUserRole(user.role));
    } else {
      localStorage.removeItem('user');
      setUserRole("visitor");
    }
  };

  const setRole = (role: UserRole) => {
    setUserRole(role);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserRoleContext.Provider value={{ user, userRole, loading, roleLoading, setRole, setUser, logout }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};

export type { UserRole };
