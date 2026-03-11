import React, { useState } from 'react';
import { FeedComment } from '../lib/api';

interface FeedInteractionProps {
    itemId: string;
    itemType: 'post' | 'reel';
    collegeId: string;
    likeCount: number;
    commentCount: number;
    hasLiked: boolean;
    comments?: FeedComment[];
    isMember?: boolean;
    onLikeToggle?: () => void;
    onCommentAdd?: (text: string) => void;
}

const FeedInteraction: React.FC<FeedInteractionProps> = ({
    itemId: _itemId,
    itemType: _itemType,
    collegeId: _collegeId,
    likeCount,
    commentCount,
    hasLiked,
    comments = [],
    isMember = false,
    onLikeToggle,
    onCommentAdd
}) => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const handleLikeToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onLikeToggle?.();
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        onCommentAdd?.(newComment);
        setNewComment('');
    };

    return (
        <div className="flex flex-col mt-auto border-t border-[#8A2FFF]/10">
            <div className="p-4 flex items-center justify-between">
                <button
                    onClick={handleLikeToggle}
                    className={`flex items-center space-x-2 transition-colors ${hasLiked ? 'text-[#FF2BCD]' : 'text-gray-400 hover:text-[#FF2BCD]'}`}
                >
                    <svg className={`w-5 h-5 ${hasLiked ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-xs font-bold">{likeCount} Likes</span>
                </button>

                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowComments(!showComments); }}
                    className={`flex items-center space-x-2 transition-colors ${showComments ? 'text-[#32F5FF]' : 'text-gray-400 hover:text-[#32F5FF]'}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-xs font-bold">{commentCount} Comments</span>
                </button>

                <button className="flex items-center space-x-2 text-gray-400 hover:text-[#8A2FFF] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                </button>
            </div>

            {showComments && (
                <div className="px-4 pb-4 space-y-3 bg-black/20 animate-fade-in">
                    <div className="max-h-40 overflow-y-auto space-y-2 pt-2 scrollbar-hide">
                        {comments.map((cmt) => (
                            <div key={cmt.id} className="text-sm">
                                <span className="font-bold text-[#32F5FF] mr-2">{cmt.author?.name || 'Anonymous'}:</span>
                                <span className="text-gray-300">{cmt.content}</span>
                            </div>
                        ))}
                        {comments.length === 0 && (
                            <p className="text-xs text-gray-500 italic text-center py-2">No comments yet</p>
                        )}
                    </div>

                    {isMember ? (
                        <form onSubmit={handleAddComment} className="flex space-x-2 pt-2 border-t border-white/5">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-[#32F5FF]/50"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="px-3 py-1 bg-[#32F5FF] text-black text-xs font-bold rounded-lg disabled:opacity-50"
                            >
                                Send
                            </button>
                        </form>
                    ) : (
                        <p className="text-[10px] text-gray-600 text-center italic pt-2">
                            Only members can comment
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FeedInteraction;
