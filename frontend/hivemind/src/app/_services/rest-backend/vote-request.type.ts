export interface VoteRequest {
    id?: number;
    UserId: number;
    IdeaId: number;
    vote : 1 | -1;
}