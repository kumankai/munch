export interface User {
    id: string;
    username: string;
}

export interface UserUpdateData {
    username?: string;
    password?: string;
} 