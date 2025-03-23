export interface IdeaType {
    id?: number;
    title: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    UserId: number;
    totalVotes?: number;
    totalUpvotes?: number;
    totalDownvotes?: number;
}