export interface LoginResponse {
    token: string;
    user: UserType;
}

export interface UserType {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
