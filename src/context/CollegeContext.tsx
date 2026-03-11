import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/axios';
import { leaveCollege, joinCollegeAsCC } from '../lib/api';
import { useUserRole } from './UserRoleContext';

export interface College {
  id: string;
  _id?: string;
  name: string;
  created_by: string;
  created_at: string;
  memberships?: Array<{ user_id: string; role: string }>;
}

interface CollegeContextType {
  colleges: College[];
  loading: boolean;
  error: string | null;
  refreshColleges: () => Promise<void>;
  joinAsCC: (collegeId: string) => Promise<{ success: boolean; message: string }>;
  leaveCC: (collegeId: string) => Promise<{ success: boolean; message: string }>;
  addCollege: (name: string) => Promise<{ success: boolean; message: string; college?: College }>;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

interface CollegeProviderProps {
  children: ReactNode;
}

export const CollegeProvider: React.FC<CollegeProviderProps> = ({ children }) => {
  const { user } = useUserRole();

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshColleges = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/colleges');
      setColleges(response.data || []);
    } catch (err: any) {
      console.error('Error loading colleges:', err);
      setError(err.response?.data?.message || 'Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshColleges();
  }, [user]);

  const joinAsCC = async (collegeId: string): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'You must be logged in to join a college.' };
    try {
      await joinCollegeAsCC(collegeId);
      await refreshColleges();
      return { success: true, message: 'Joined college as Campus Coordinator!' };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to join college.';
      return { success: false, message: msg };
    }
  };

  const leaveCC = async (collegeId: string): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'You must be logged in.' };
    try {
      await leaveCollege(collegeId);
      await refreshColleges();
      return { success: true, message: 'Left college successfully.' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Failed to leave college.' };
    }
  };

  const addCollege = async (
    name: string
  ): Promise<{ success: boolean; message: string; college?: College }> => {
    if (!user) return { success: false, message: 'You must be logged in to create a college.' };
    if (!name.trim()) return { success: false, message: 'College name cannot be empty.' };

    try {
      const response = await api.post('/colleges', { name: name.trim() });
      await refreshColleges();
      return {
        success: true,
        message: `College "${name}" created! You are now its first Campus Coordinator.`,
        college: response.data,
      };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create college.';
      return { success: false, message: msg };
    }
  };

  return (
    <CollegeContext.Provider
      value={{ colleges, loading, error, refreshColleges, joinAsCC, leaveCC, addCollege }}
    >
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollege = (): CollegeContextType => {
  const context = useContext(CollegeContext);
  if (context === undefined) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
};
