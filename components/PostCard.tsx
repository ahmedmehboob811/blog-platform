
import React from 'react';
import { Post } from '../types';
import { useApp } from '../context/AppContext';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { setView } = useApp();

    const snippet = post.content.split(' ').slice(0, 25).join(' ') + '...';

    return (
        <div 
            onClick={() => setView({ page: 'post', postId: post.id })}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        >
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <img src={post.author.imageUrl} alt={post.author.fullName || 'Author'} className="h-10 w-10 rounded-full mr-4" />
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{post.author.fullName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{post.createdAt.toLocaleDateString()}</p>
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">{post.title}</h2>
                <p className="text-gray-600 dark:text-gray-300">{snippet}</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                <span className="inline-block bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded-full">Read more &rarr;</span>
            </div>
        </div>
    );
};

export default PostCard;
