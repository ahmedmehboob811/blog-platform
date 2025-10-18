
import React from 'react';
import { useApp } from '../context/AppContext';
import PostCard from './PostCard';
import LoadingSpinner from './LoadingSpinner';

const PostList: React.FC = () => {
    const { filteredPosts, isLoading, error, searchQuery } = useApp();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (filteredPosts.length === 0) {
        return (
            <div className="text-center text-gray-500 py-16">
                <h2 className="text-2xl font-semibold">No posts found</h2>
                <p className="mt-2">
                    {searchQuery ? `Your search for "${searchQuery}" did not return any results.` : 'There are no posts to display yet.'}
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
};

export default PostList;
