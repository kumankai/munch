export interface User {
    id: string;
    username: string;
}

export interface UserUpdatePassword {
    password?: string;
    old_password?: string;
} 