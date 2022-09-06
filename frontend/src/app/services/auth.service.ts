import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable, BehaviorSubject } from "rxjs";
import { first, catchError, tap } from "rxjs/operators";

import { User } from "../models/User";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = "http://localhost:3000/auth";
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: string;
  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userName: string;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  )
  {
     //this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('userName')));
  this.currentUser =localStorage.getItem('userName')
}
public get currentUserValue(): string {
  return localStorage.getItem('userName');
}
  signup(user: Omit<User, "id">): Observable<User> {
    return this.http
      .post<User>(`${this.url}/signup`, user, this.httpOptions)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<User>("signup"))
      );
  }

  login(
    email: Pick<User, "email">,
    password: Pick<User, "password">
  ): Observable<{
    token: string;
    userName: string;
  }> {
    return this.http
      .post(`${this.url}/login`, { email, password }, this.httpOptions)
      .pipe(
        first(),
        tap((tokenObject: { token: string; userName: string }) => {
          this.userName = tokenObject.userName;
          localStorage.setItem("token", tokenObject.token);
          localStorage.setItem("userName", tokenObject.userName);
          this.isUserLoggedIn$.next(true);
          this.router.navigate(["after-connect"]);
        }),
        catchError(
          this.errorHandlerService.handleError<{
            token: string;
            userName: string;
          }>("login")
        )
      );
  }
}
