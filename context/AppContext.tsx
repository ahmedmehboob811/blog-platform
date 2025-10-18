import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Post, Comment } from '../types';
import * as db from '../services/database';

type View = 
    | { page: 'home' }
    | { page: 'post'; postId: string }
    | { page: 'create' }
    | { page: 'edit'; postId: string };

interface AppContextType {
    posts: Post[];
    comments: Comment[];
    isLoading: boolean;
    error: string | null;
    view: View;
    setView: (view: View) => void;
    addPost: (title: string, content: string, author: db.Author) => Promise<void>;
    addComment: (text: string, postId: string, author: db.Author) => Promise<void>;
    updatePost: (id: string, title: string, content: string) => Promise<void>;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredPosts: Post[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<View>({ page: 'home' });
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [postsData, commentsData] = await Promise.all([
                db.getPosts(),
                db.getAllComments()
            ]);
            setPosts(postsData);
            setComments(commentsData);
            setError(null);
        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addPost = async (title: string, content: string, author: db.Author) => {
        const newPost = await db.addPost(title, content, author);
        setPosts(prevPosts => [newPost, ...prevPosts]);
        setView({ page: 'post', postId: newPost.id });
    };

    const addComment = async (text: string, postId: string, author: db.Author) => {
        const newComment = await db.addComment(text, postId, author);
        setComments(prevComments => [...prevComments, newComment]);
    };

    const updatePost = async (id: string, title: string, content: string) => {
        const updatedPost = await db.updatePost(id, title, content);
        setPosts(prevPosts => 
            prevPosts.map(post => post.id === id ? updatedPost : post)
        );
        setView({ page: 'post', postId: id });
    };

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppContext.Provider value={{
            posts,
            comments,
            isLoading,
            error,
            view,
            setView,
            addPost,
            addComment,
            updatePost,
            searchQuery,
            setSearchQuery,
            filteredPosts,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};