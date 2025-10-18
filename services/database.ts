import { Post, Comment, User } from '../types';

// This file mocks a Supabase backend. In a real application, you would use
// the Supabase client library to interact with your database.

export type Author = Omit<User, 'id'> & { id: string | undefined };

const mockUsers: { [id: string]: User } = {
    'user_1': { id: 'user_1', fullName: 'Alice Johnson', imageUrl: 'https://picsum.photos/id/1011/100/100' },
    'user_2': { id: 'user_2', fullName: 'Bob Williams', imageUrl: 'https://picsum.photos/id/1012/100/100' },
};

let mockPosts: Post[] = [
    {
        id: '1',
        title: 'Exploring the World of React Hooks',
        content: 'React Hooks have revolutionized how we write components. In this post, we will take a deep dive into `useState`, `useEffect`, and `useContext`.\n\n### useState\n\nThe `useState` hook is your best friend for managing component state. It\'s simple, powerful, and easy to understand.\n\n```javascript\nconst [count, setCount] = useState(0);\n```\n\n### useEffect\n\nFor side effects like data fetching or subscriptions, `useEffect` is the tool for the job. It runs after every render, or you can control when it runs with its dependency array.\n\n*   **Data Fetching:** Perfect for API calls.\n*   **Subscriptions:** Clean up with the return function.\n\nThis is just the beginning. Stay tuned for more!',
        author: mockUsers['user_1'],
        createdAt: new Date('2023-10-26T10:00:00Z'),
    },
    {
        id: '2',
        title: 'A Guide to Modern CSS with Tailwind',
        content: 'Tailwind CSS is a utility-first CSS framework that allows for rapid UI development. Instead of writing custom CSS, you apply pre-existing classes directly in your HTML.\n\n**Pros:**\n- Fast development speed\n- Consistent design\n- Highly customizable\n\n**Cons:**\n- Can lead to "class soup" in HTML\n- Steeper learning curve for beginners\n\nOverall, Tailwind is an excellent choice for projects of all sizes.',
        author: mockUsers['user_2'],
        createdAt: new Date('2023-10-25T14:30:00Z'),
    },
];

let mockComments: Comment[] = [
    { id: 'c1', postId: '1', text: 'Great article! Very helpful for understanding hooks.', author: mockUsers['user_2'], createdAt: new Date('2023-10-26T11:00:00Z') },
    { id: 'c2', postId: '1', text: 'I finally get how useEffect cleanup works. Thanks!', author: mockUsers['user_1'], createdAt: new Date('2023-10-26T12:00:00Z') },
];

const simulateDelay = <T,>(data: T): Promise<T> => 
    new Promise(resolve => setTimeout(() => resolve(data), 500));

export const getPosts = (): Promise<Post[]> => {
    // In Supabase: await supabase.from('posts').select('*, author:author_id(*)').order('created_at', { ascending: false });
    return simulateDelay([...mockPosts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
};

export const getPostById = (id: string): Promise<Post | undefined> => {
    // In Supabase: await supabase.from('posts').select('*, author:author_id(*)').eq('id', id).single();
    return simulateDelay(mockPosts.find(p => p.id === id));
};

export const getCommentsByPostId = (postId: string): Promise<Comment[]> => {
    // In Supabase: await supabase.from('comments').select('*, author:user_id(*)').eq('post_id', postId);
    return simulateDelay(mockComments.filter(c => c.postId === postId));
};

export const getAllComments = (): Promise<Comment[]> => {
    return simulateDelay(mockComments);
};


export const addPost = (title: string, content: string, author: Author): Promise<Post> => {
    const newPost: Post = {
        id: String(Date.now()),
        title,
        content,
        author: {
            id: author.id || `guest_${Date.now()}`,
            fullName: author.fullName,
            imageUrl: author.imageUrl
        },
        createdAt: new Date(),
    };
    mockPosts = [newPost, ...mockPosts];
    // In Supabase: await supabase.from('posts').insert([{ title, content, author_id: author.id }]);
    return simulateDelay(newPost);
};

export const addComment = (text: string, postId: string, author: Author): Promise<Comment> => {
    const newComment: Comment = {
        id: `c${Date.now()}`,
        text,
        postId,
        author: {
            id: author.id || `guest_${Date.now()}`,
            fullName: author.fullName,
            imageUrl: author.imageUrl
        },
        createdAt: new Date(),
    };
    mockComments = [...mockComments, newComment];
    // In Supabase: await supabase.from('comments').insert([{ text, post_id: postId, user_id: author.id }]);
    return simulateDelay(newComment);
};

export const updatePost = (id: string, title: string, content: string): Promise<Post> => {
    const postIndex = mockPosts.findIndex(p => p.id === id);
    if (postIndex === -1) {
        return Promise.reject(new Error('Post not found'));
    }
    const updatedPost = {
        ...mockPosts[postIndex],
        title,
        content,
    };
    mockPosts[postIndex] = updatedPost;
    // In Supabase: await supabase.from('posts').update({ title, content }).match({ id });
    return simulateDelay(updatedPost);
};

// In a real app, this would be a call to a Supabase RPC function using Full-Text Search
export const searchPosts = (query: string): Promise<Post[]> => {
    if (!query) return getPosts();
    const lowercasedQuery = query.toLowerCase();
    const results = mockPosts.filter(post =>
        post.title.toLowerCase().includes(lowercasedQuery) ||
        post.content.toLowerCase().includes(lowercasedQuery)
    );
    return simulateDelay(results);
};