export interface ApiError {
    response?: {
        data?: {
            error?: string;
        };
        status?: number;
    };
    message: string;
} 

export interface UpdateError {
    message?: string;
    error?: string;
}