import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRequest } from './auth-request.type';
import { SignUpRequest } from './signup-request.type';
import { SortingType } from './sorting.type';
import { IdeaType } from './idea.type';
import { VoteRequest } from './vote-request.type';
import { LoginResponse, UserType } from './login-response.type';

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
  currentUser: UserType = {id: 0, firstName: '', lastName: '', email: '', password: ''};

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
    const url = `${this.url}/idea/${this.sorting}/${pageNumber}`;
    return this.http.get<IdeaType[]>(url, this.httpOptions);
  }

  voteIdea(voteRequest : VoteRequest){
    const url = `${this.url}/vote`;
    return this.http.post(url, voteRequest, this.httpOptions);
  }

  setUser(user: UserType){
    this.currentUser = user;
  }
}