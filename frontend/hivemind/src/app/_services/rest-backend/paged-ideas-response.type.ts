import { IdeaType } from "./idea.type";

export interface PagedIdeasType {
    ideas: IdeaType[],
    totalPages: number
}