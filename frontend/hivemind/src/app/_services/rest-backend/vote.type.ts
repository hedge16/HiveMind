export interface VoteType {
    id?: number;
    UserId: number;
    IdeaId: number;
    vote : 1 | -1;
}