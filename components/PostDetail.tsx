import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useUser, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useApp } from '../context/AppContext';
import { Post, Comment } from '../types';
import * as db from '../services/database';
import { summarizeContent } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { AIBotIcon, BackIcon, EditIcon } from './Icons';

interface PostDetailProps {
    postId: string;
}

const PostDetail: React.FC<PostDetailProps> = ({ postId }) => {
    const { comments, addComment, setView } = useApp();
    const { user } = useUser();
    
    const [post, setPost] = useState<Post | null>(null);
    const [postComments, setPostComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            const postData = await db.getPostById(postId);
            if (postData) {
                setPost(postData);
            }
            setIsLoading(false);
        };
        fetchPost();
    }, [postId]);

    useEffect(() => {
        setPostComments(comments.filter(c => c.postId === postId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()));
    }, [comments, postId]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() && user) {
            const author = {
                id: user.id,
                fullName: user.fullName,
                imageUrl: user.imageUrl,
            };
            await addComment(newComment, postId, author);
            setNewComment('');
        }
    };

    const handleGenerateSummary = async () => {
        if (!post) return;
        setIsSummarizing(true);
        const result = await summarizeContent(post.content);
        setSummary(result);
        setIsSummarizing(false);
    };

    if (isLoading) return <div className="flex justify-center mt-16"><LoadingSpinner /></div>;
    if (!post) return <div className="text-center">Post not found.</div>;

    const isAuthor = user && user.id === post.author.id;

    return (
        <div className="max-w-4xl mx-auto">
             <button
                onClick={() => setView({ page: 'home' })}
                className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400 hover:underline"
            >
                <BackIcon className="w-5 h-5" />
                Back to all posts
            </button>
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8">
                <div className="flex items-center mb-4">
                    <img src={post.author.imageUrl} alt={post.author.fullName || 'Author'} className="h-12 w-12 rounded-full mr-4" />
                    <div>
                        <p className="font-bold text-lg text-gray-900 dark:text-white">{post.author.fullName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{post.createdAt.toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex justify-between items-start gap-4">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 flex-1">{post.title}</h1>
                    {isAuthor && (
                        <button
                            onClick={() => setView({ page: 'edit', postId: post.id })}
                            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full hover:bg-indigo-200 dark:bg-gray-700 dark:text-indigo-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                           <EditIcon className="h-4 w-4"/>
                           <span>Edit</span>
                        </button>
                    )}
                </div>
                
                <div className="border-t border-b border-gray-200 dark:border-gray-700 my-8 py-4">
                    <button
                        onClick={handleGenerateSummary}
                        disabled={isSummarizing}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                        {isSummarizing ? <LoadingSpinner size="sm" /> : <AIBotIcon className="w-5 h-5" />}
                        <span>{isSummarizing ? 'Generating...' : 'Generate AI Summary'}</span>
                    </button>
                    {summary && (
                        <div className="mt-4 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg border border-indigo-200 dark:border-gray-600">
                            <p className="text-indigo-800 dark:text-indigo-200">{summary}</p>
                        </div>
                    )}
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                </div>
            </article>

            <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Comments ({postComments.length})</h2>
                <div className="space-y-6">
                    {postComments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                            <img src={comment.author.imageUrl} alt={comment.author.fullName || 'Author'} className="h-10 w-10 rounded-full" />
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <p className="font-semibold text-gray-900 dark:text-white">{comment.author.fullName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{comment.createdAt.toLocaleString()}</p>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <SignedIn>
                        <form onSubmit={handleCommentSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                            <textarea
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                rows={3}
                            />
                            <button type="submit" className="mt-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                Post Comment
                            </button>
                        </form>
                    </SignedIn>
                     <SignedOut>
                        <div className="text-center p-4 border-2 border-dashed rounded-lg">
                           <p className="mb-2">You must be signed in to comment.</p>
                           <SignInButton mode="modal">
                             <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700">
                                Sign In
                            </button>
                           </SignInButton>
                        </div>
                    </SignedOut>
                </div>
            </section>
        </div>
    );
};

export default PostDetail;