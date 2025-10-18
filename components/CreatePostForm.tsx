import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useApp } from '../context/AppContext';

interface CreatePostFormProps {
    postId?: string;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ postId }) => {
    const { addPost, setView, posts, updatePost } = useApp();
    const { user } = useUser();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = !!postId;

    useEffect(() => {
        if (isEditMode) {
            const postToEdit = posts.find(p => p.id === postId);
            if (postToEdit) {
                setTitle(postToEdit.title);
                setContent(postToEdit.content);
            }
        }
    }, [isEditMode, postId, posts]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !user) return;
        
        setIsSubmitting(true);
        
        try {
            if (isEditMode) {
                await updatePost(postId, title, content);
            } else {
                const author = {
                    id: user.id,
                    fullName: user.fullName,
                    imageUrl: user.imageUrl,
                };
                await addPost(title, content, author);
            }
        } catch (error) {
            console.error(isEditMode ? "Failed to update post" : "Failed to create post", error);
            // Handle error state if necessary
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Post' : 'Create New Post'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content (Markdown)</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                        rows={15}
                        required
                    />
                     <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        You can use Markdown for formatting. For example, `# Heading` or `**bold**`.
                     </p>
                </div>
                <div className="flex justify-end gap-4">
                     <button
                        type="button"
                        onClick={() => isEditMode ? setView({ page: 'post', postId }) : setView({ page: 'home'})}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                        {isSubmitting ? (isEditMode ? 'Saving...' : 'Publishing...') : (isEditMode ? 'Save Changes' : 'Publish Post')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePostForm;