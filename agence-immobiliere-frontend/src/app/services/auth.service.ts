import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string, isAdmin: boolean = false): Observable<User> {
    const loginUrl = isAdmin ?
      `${this.apiUrl}/auth/login/admin` :
      `${this.apiUrl}/auth/login/user`;

    return this.http.post<any>(loginUrl, { email, password })
      .pipe(
        map(response => {
          const user: User = {
            id: response.id,
            username: response.username,
            email: email,
            role: response.userType.toLowerCase(),
            token: response.token
          };

          // Store user details and jwt token in local storage
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  register(user: User, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/users/register`, user, { params: { password } })
      .pipe(
        map(response => {
          const newUser: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            role: 'user'
          };
          return newUser;
        })
      );
  }

  logout() {
    // Remove user from local storage and update currentUserSubject
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }
}
