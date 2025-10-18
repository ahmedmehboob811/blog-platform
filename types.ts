
export interface User {
    id: string;
    fullName: string | null;
    imageUrl: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    author: User;
    createdAt: Date;
}

export interface Comment {
    id: string;
    text: string;
    author: User;
    postId: string;
    createdAt: Date;
}
