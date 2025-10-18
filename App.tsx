
import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import CreatePostForm from './components/CreatePostForm';

const AppContent: React.FC = () => {
    const { view } = useApp();

    const renderView = () => {
        switch (view.page) {
            case 'home':
                return <PostList />;
            case 'post':
                return <PostDetail postId={view.postId} />;
            case 'create':
                return <CreatePostForm />;
            case 'edit':
                return <CreatePostForm postId={view.postId} />;
            default:
                return <PostList />;
        }
    };
    
    return (
        <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200">
            <Header />
            <main className="container mx-auto px-4 py-8">
                {renderView()}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;