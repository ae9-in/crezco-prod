/**
 * CREZCO — Extended API Helpers (api.ts)
 * Migrated from Supabase to MongoDB + Node.js
 */

import api from './axios';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface FeedPost {
  id: string;
  _id?: string;
  feed_id: string;
  type: 'post';
  college_id: string;
  created_by: string;
  content: string;
  media_url: string | null;
  media_type: 'image' | 'video' | 'none';
  created_at: string;
  author: { name: string; email: string } | null;
  like_count: number;
  comment_count: number;
  has_liked: boolean;
}

export interface FeedComment {
  id: string;
  _id?: string;
  user_id: string;
  item_id: string;
  item_type: 'post' | 'reel';
  content: string;
  created_at: string;
  author: { name: string } | null;
}

export interface FeedEvent {
  id: string;
  _id?: string;
  feed_id: string;
  type: 'event';
  college_id: string;
  created_by: string;
  title: string;
  description: string | null;
  event_date: string;
  created_at: string;
  college_id_populated?: { name: string };
}

export interface FeedReel {
  id: string;
  _id?: string;
  feed_id: string;
  type: 'reel';
  college_id: string;
  created_by: string;
  caption: string | null;
  video_url: string;
  created_at: string;
  author: { name: string } | null;
  like_count: number;
  comment_count: number;
  has_liked: boolean;
}

export type FeedItem = FeedPost | FeedEvent | FeedReel;

// ─────────────────────────────────────────────
// Feed
// ─────────────────────────────────────────────

export async function getCollegeFeed(collegeId: string): Promise<FeedItem[]> {
  const response = await api.get(`/posts/college/${collegeId}`);
  return response.data;
}

export async function getGlobalFeed(): Promise<FeedItem[]> {
  const response = await api.get('/posts/global');
  return response.data;
}

export async function getCommunityFeed(): Promise<FeedItem[]> {
  const response = await api.get('/posts/community');
  return response.data;
}

// ─────────────────────────────────────────────
// Memberships
// ─────────────────────────────────────────────

export async function getUserColleges() {
  const response = await api.get('/colleges/my');
  return response.data;
}

export async function getUserMembershipRole(
  collegeId: string
): Promise<'cc' | 'member' | null> {
  const response = await api.get(`/colleges/${collegeId}/role`);
  return response.data.role || null;
}

export async function joinCollegeAsCC(collegeId: string) {
  const response = await api.post(`/colleges/${collegeId}/join`, { role: 'cc' });
  return response.data;
}

export async function joinCollege(collegeId: string) {
  const response = await api.post(`/colleges/${collegeId}/join`, { role: 'member' });
  return response.data;
}

export async function leaveCollege(collegeId: string) {
  const response = await api.delete(`/colleges/${collegeId}/leave`);
  return response.data;
}

// ─────────────────────────────────────────────
// Posts
// ─────────────────────────────────────────────

export async function createPost(collegeId: string, content: string) {
  const response = await api.post('/posts', { college_id: collegeId, content });
  return response.data;
}

export async function deletePost(postId: string) {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
}

// ─────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────

export async function createEvent(
  collegeId: string,
  title: string,
  description: string,
  eventDate: string
) {
  const response = await api.post('/events', { 
    college_id: collegeId, 
    title, 
    description, 
    event_date: eventDate 
  });
  return response.data;
}

export async function deleteEvent(eventId: string) {
  const response = await api.delete(`/events/${eventId}`);
  return response.data;
}

// ─────────────────────────────────────────────
// Reels
// ─────────────────────────────────────────────

export async function getReelsByCollege(collegeId: string) {
  const response = await api.get(`/reels/college/${collegeId}`);
  return response.data;
}

export async function deleteReel(reelId: string) {
  const response = await api.delete(`/reels/${reelId}`);
  return response.data;
}

// ─────────────────────────────────────────────
// Leaderboard
// ─────────────────────────────────────────────

export async function getTopCoordinators() {
  const response = await api.get('/leaderboard/coordinators');
  return response.data;
}

export async function getTopColleges() {
  const response = await api.get('/leaderboard/colleges');
  return response.data;
}

// ─────────────────────────────────────────────
// Like System
// ─────────────────────────────────────────────

export async function toggleLike(itemId: string, itemType: 'post' | 'reel') {
  const response = await api.post('/interactions/like', { item_id: itemId, item_type: itemType });
  return response.data;
}

export async function getLikeCount(itemId: string, itemType: 'post' | 'reel'): Promise<number> {
  const response = await api.get(`/interactions/likes?item_id=${itemId}&item_type=${itemType}`);
  return response.data.count;
}

export async function hasUserLiked(itemId: string, itemType: 'post' | 'reel'): Promise<boolean> {
  const response = await api.get(`/interactions/has_liked?item_id=${itemId}&item_type=${itemType}`);
  return response.data.hasLiked;
}

// ─────────────────────────────────────────────
// Comment System
// ─────────────────────────────────────────────

export async function addComment(itemId: string, type: 'post' | 'reel', text: string) {
  const response = await api.post('/interactions/comment', { 
    item_id: itemId, 
    item_type: type, 
    content: text 
  });
  return response.data;
}

// ─────────────────────────────────────────────
// Notification System
// ─────────────────────────────────────────────

export async function getNotifications() {
  const response = await api.get('/notifications');
  return response.data;
}

export async function markNotificationRead(notificationId: string) {
  const response = await api.put(`/notifications/${notificationId}`);
  return response.data;
}

export async function markAllNotificationsRead() {
  const response = await api.put('/notifications/mark-all-read');
  return response.data;
}
