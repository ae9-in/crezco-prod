import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, userApi } from '../lib/supabase';

const UserRoleContext = createContext(undefined);

const convertToUserRole = (role) => {
  if (role === 'cc' || role === 'member' || role === 'admin') {
    return role;
  }
  return 'member';
};

export const UserRoleProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [userRole, setUserRole] = useState("visitor");
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        try {
          setRoleLoading(true);
          const profile = await userApi.getUserProfile(session.user.id);
          const userData = { ...session.user, ...profile };
          setUserState(userData);
          setUserRole(convertToUserRole(userData.role));
        } catch (err) {
          console.error('Error fetching profile:', err);
          setUserState(session.user);
          setUserRole("member");
        } finally {
          setRoleLoading(false);
        }
      } else {
        setUserState(null);
        setUserRole("visitor");
      }
      setLoading(false);
    };

    checkUser();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await userApi.getUserProfile(session.user.id);
        const userData = { ...session.user, ...profile };
        setUserState(userData);
        setUserRole(convertToUserRole(userData.role));
      } else {
        setUserState(null);
        setUserRole("visitor");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      setUserRole(convertToUserRole(userData.role));
    } else {
      setUserRole("visitor");
    }
  };

  const setRole = (role) => {
    setUserRole(role);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUserState(null);
    setUserRole("visitor");
  };

  return (
    <UserRoleContext.Provider value={{ user, userRole, loading, roleLoading, setRole, setUser, logout }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
