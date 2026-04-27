import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

// College API
export const collegeApi = {
  async createCollege(name, userId) {
    const { data, error } = await supabase
      .from('colleges')
      .insert([{ name, created_by: userId }])
      .select()
      .single();

    if (error) throw error;

    // Auto-add creator as CC
    const { error: memberError } = await supabase
      .from('memberships')
      .insert([{ user_id: userId, college_id: data.id, role: 'cc' }]);

    if (memberError) throw memberError;

    return data;
  },

  async getColleges() {
    const { data, error } = await supabase
      .from('colleges')
      .select(`
        *,
        memberships (count)
      `);
    if (error) throw error;
    return data;
  },

  async getCollege(id) {
    const { data, error } = await supabase
      .from('colleges')
      .select(`
        *,
        memberships (*),
        posts (*),
        events (*)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async joinCollege(collegeId, userId) {
    const { data, error } = await supabase
      .from('memberships')
      .insert([{ user_id: userId, college_id: collegeId, role: 'member' }]);
    if (error) throw error;
    return data;
  },

  async isMember(collegeId, userId) {
    if (!userId) return false;
    const { data, error } = await supabase
      .from('memberships')
      .select('role')
      .eq('college_id', collegeId)
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }
};

// Post API
export const postApi = {
  async createPost(collegeId, userId, content) {
    const { data, error } = await supabase
      .from('posts')
      .insert([{ college_id: collegeId, user_id: userId, content }])
      .select();
    if (error) throw error;
    return data[0];
  },

  async getPostsByCollege(collegeId) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (name)
      `)
      .eq('college_id', collegeId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getCommunityFeed() {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:user_id (name),
        college:college_id (name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) throw error;
    return data;
  }
};

// Event API
export const eventApi = {
  async createEvent(collegeId, title, description, date) {
    const { data, error } = await supabase
      .from('events')
      .insert([{ college_id: collegeId, title, description, date }])
      .select();
    if (error) throw error;
    return data[0];
  },

  async getEventsByCollege(collegeId) {
    let query = supabase
      .from('events')
      .select(`
        *,
        college:college_id (name)
      `)
      .order('date', { ascending: true });
    
    if (collegeId) {
      query = query.eq('college_id', collegeId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getEvent(id) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        college:college_id (name),
        creator:created_by (name)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }
};

// Gig API
export const gigApi = {
  async getGigs(filters = {}) {
    let query = supabase
      .from('gigs')
      .select(`
        *,
        creator:created_by (name)
      `)
      .order('created_at', { ascending: false });

    if (filters.category) query = query.eq('category', filters.category);
    if (filters.type) query = query.eq('type', filters.type);
    if (filters.search) query = query.ilike('title', `%${filters.search}%`);
    
    if (filters.sortBy === 'stipend') {
      query = query.order('stipend', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async applyForGig(gigId, userId, applicationData) {
    const { data, error } = await supabase
      .from('applications')
      .insert([{ 
        gig_id: gigId, 
        user_id: userId, 
        ...applicationData 
      }]);
    if (error) throw error;
    return data;
  }
};

// User API
export const userApi = {
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async createUserProfile(profile) {
    const { data, error } = await supabase
      .from('users')
      .insert([profile])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// Notification API
export const notificationApi = {
  async getNotifications(userId) {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:actor_id (name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async markNotificationRead(id) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    if (error) throw error;
  },

  async markAllNotificationsRead(userId) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    if (error) throw error;
  }
};

// Metrics API
export const metricsApi = {
  async getMetrics() {
    try {
      const [users, colleges, events, posts] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('colleges').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true })
      ]);

      return {
        users: users.count || 0,
        colleges: colleges.count || 0,
        events: events.count || 0,
        posts: posts.count || 0
      };
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
      return { users: 0, colleges: 0, events: 0, posts: 0 };
    }
  },

  async getLeaderboardData() {
    // Simplified leaderboard data
    const { data: coordinators, error: coordError } = await supabase
      .from('users')
      .select('*, events(count)')
      .limit(10);
    
    const { data: colleges, error: collError } = await supabase
      .from('colleges')
      .select('*, events(count)')
      .limit(10);

    if (coordError || collError) throw coordError || collError;

    return {
      coordinators: (coordinators || []).map(c => ({ ...c, eventCount: c.events?.[0]?.count || 0 })),
      colleges: (colleges || []).map(c => ({ ...c, eventCount: c.events?.[0]?.count || 0 }))
    };
  }
};
