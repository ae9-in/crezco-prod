import React, { createContext, useContext, useState, useEffect } from 'react';
import { collegeApi } from '../lib/supabase';
import { useUserRole } from './UserRoleContext';

const CollegeContext = createContext();

export const CollegeProvider = ({ children }) => {
  const { user } = useUserRole();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshColleges = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await collegeApi.getColleges();
      setColleges(data || []);
    } catch (err) {
      console.error('Error loading colleges:', err);
      setError(err.message || 'Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshColleges();
  }, [user]);

  const joinAsCC = async (collegeId) => {
    if (!user) return { success: false, message: 'You must be logged in to join a college.' };
    try {
      await collegeApi.joinCollege(collegeId, user.id); // Defaulting to member role for now, but CC logic can be added
      await refreshColleges();
      return { success: true, message: 'Joined college community!' };
    } catch (err) {
      return { success: false, message: err.message || 'Failed to join college.' };
    }
  };

  const addCollege = async (name) => {
    if (!user) return { success: false, message: 'You must be logged in to create a college.' };
    if (!name.trim()) return { success: false, message: 'College name cannot be empty.' };

    try {
      const data = await collegeApi.createCollege(name.trim(), user.id);
      await refreshColleges();
      return {
        success: true,
        message: `College "${name}" created! You are now its first Campus Coordinator.`,
        college: data,
      };
    } catch (err) {
      return { success: false, message: err.message || 'Failed to create college.' };
    }
  };

  return (
    <CollegeContext.Provider
      value={{ colleges, loading, error, refreshColleges, joinAsCC, addCollege }}
    >
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollege = () => {
  const context = useContext(CollegeContext);
  if (context === undefined) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
};
