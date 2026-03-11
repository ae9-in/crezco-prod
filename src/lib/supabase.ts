// Supabase client is no longer used.
// All API calls have been migrated to the Node.js + MongoDB backend.
export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null }, error: new Error('Supabase is disabled') }),
    signUp: async () => ({ data: { user: null }, error: new Error('Supabase is disabled') }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({
        eq: () => ({
            single: () => ({ data: null, error: null }),
            order: () => ({ data: [], error: null }),
        }),
        in: () => ({ data: [], error: null }),
        order: () => ({ data: [], error: null }),
    }),
  }),
  storage: {
    from: () => ({
        remove: async () => ({ error: null }),
    }),
  }
} as any;

export const userApi = {
    getUserProfile: async () => null,
};
