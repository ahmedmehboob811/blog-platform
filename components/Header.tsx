
import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useApp } from '../context/AppContext';
import { LogoIcon, SearchIcon, WriteIcon } from './Icons';

const Header: React.FC = () => {
    const { setView, searchQuery, setSearchQuery } = useApp();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value.trim() !== '') {
            setView({ page: 'home' }); // Ensure we are on home page to see search results
        }
    };
    
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                        setSearchQuery('');
                        setView({ page: 'home' });
                    }}
                >
                    <LogoIcon className="h-8 w-8 text-indigo-500" />
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AI Blog</h1>
                </div>

                <div className="flex-1 max-w-md mx-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <SignedIn>
                        <button 
                            onClick={() => setView({ page: 'create' })}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                           <WriteIcon className="h-5 w-5"/>
                           <span>New Post</span>
                        </button>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </header>
    );
};

export default Header;
