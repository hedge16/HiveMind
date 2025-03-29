import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRequest } from './auth-request.type';
import { SignUpRequest } from './signup-request.type';
import { SortingType } from './sorting.type';
import { IdeaType } from './idea.type';
import { VoteType } from './vote.type';
import { LoginResponse, UserType } from './login-response.type';
import { CommentType } from './comment.type';
import { PagedIdeasType } from './paged-ideas-response.type';

@Injectable({
  providedIn: 'root'
})
export class RestBackendService {
  url = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  sorting : SortingType = 'controversial';
  pageNumber = 1;

  login(loginRequest: AuthRequest){
    const url = `${this.url}/auth`; 
    return this.http.post<LoginResponse>(url, loginRequest, this.httpOptions);
  }

  signup(signupRequest: SignUpRequest){
    const url = `${this.url}/signup`; 
    console.log(signupRequest);
    return this.http.post(url, signupRequest, this.httpOptions);
  }

  getPagedIdeas(sorting: SortingType, pageNumber: number){
    const url = `${this.url}/idea/${sorting}/${pageNumber}`;
    return this.http.get<PagedIdeasType>(url, this.httpOptions);
  }

  voteIdea(voteRequest : VoteType){
    const url = `${this.url}/vote`;
    return this.http.post(url, voteRequest, this.httpOptions);
  }

  createIdea(idea: IdeaType){
    const url = `${this.url}/idea`;
    return this.http.post(url, idea, this.httpOptions);
  }

  createComment(comment: CommentType){
    const url = `${this.url}/comment`;
    return this.http.post(url, comment, this.httpOptions);
  }

  getComments(ideaId: number){
    const url = `${this.url}/comment/idea/${ideaId}`;
    return this.http.get<CommentType[]>(url, this.httpOptions);
  }

  getIdeaById(ideaId: number){
    const url = `${this.url}/idea/${ideaId}`;
    return this.http.get<IdeaType>(url, this.httpOptions);
  }

  changeVote(vote: VoteType){
    const url = `${this.url}/vote`;
    return this.http.patch<VoteType>(url, vote, this.httpOptions);
  }

  getVotesByUserId(userId: number){
    const url = `${this.url}/vote/user/${userId}`
    return this.http.get<VoteType[]>(url, this.httpOptions);
  }
  
  setUser(user: UserType) {
    localStorage.setItem('currentUser', JSON.stringify(user)); // Save user to localStorage
  }

  clearUser() {
    localStorage.removeItem('currentUser'); // Remove user from localStorage
  }
}