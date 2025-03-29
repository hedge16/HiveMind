import { UserType } from "./login-response.type";

export interface CommentType {
    id?: number;
    content: string;
    createdAt: string;
    updatedAt?: string;
    UserId: number;
    IdeaId: number;
    User?: UserType
}