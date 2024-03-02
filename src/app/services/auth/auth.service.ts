import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
//import { environment } from 'src/environments/environment.development';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userEmail: string | null = null;
  private serverAddress = environment.serverAddress;
  loggedInSignal = signal(false);

  constructor(private http: HttpClient) {
    let userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      this.updateLoginStatus(true);
      this.userEmail = JSON.parse(userInfo).email;
    }
  }

  /**
   * get the current user's email
   * @returns user email, or null if the user is signed out
   */
  getUserEmail(): string | null {
    return this.userEmail;
  }

  /**
   * regsiters a user
   * @param email email to register with
   * @param password user's password
   * @returns Observable with registeration information
   */
  register(email: string, password: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };

    const userData = {
      email: email,
      password: password
    }

    return this.http.post(this.serverAddress + '/api/auth/register', userData, httpOptions).pipe(
      tap(() => {
        this.updateLoginStatus(true);
      }),
      catchError(this.handleError<any>('Registration'))
    )
  }


  /**
   * Logging in a user
   * @param email the user's email
   * @param password the user's password
   * @returns Observable that contains login information
   */
  login(email: string, password: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };

    const userData = {
      email: email,
      password: password
    }

    return this.http.post(this.serverAddress + '/api/auth/login', userData, httpOptions).pipe(
      tap(() => {
        this.updateLoginStatus(true)
      }),
      catchError(this.handleError<any>('login')
      ))
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * The http.post should return an observable, so we make sure it will return one.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed.`);
      let message = ''
      if (error.error.message) {
        console.log(error.error.message)
        message = error.error.message;
      }
      //My backend is designed to return an error as "error.error.message". if its not exists, and there is an error - that means that backend is unavailable
      else {
        message = "Communication error.";
      }
      let msg = {
        message: message,
        successfull: false
      }
      console.log(error)
      // Let the app keep running by returning an empty result.
      return of(msg as T);
    };
  }

  /**
   * Checks if the stored JWT is valid
   * @param email user'e email
   * @returns Observable with validation information
   */
  validateStoredTokens(email: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };

    const userData = {
      email: email,
    }
    return this.http.post(this.serverAddress + '/api/auth/check-tokens', userData, httpOptions).pipe(
      tap(res => {
        this.updateLoginStatus(true)
      }),
      catchError(this.handleError<any>('validation'))
    )
  }

  /**
   * Preforming a logout
   */
  logout() {
    const httpOptions = {
      withCredentials: true
    };

    return this.http.delete(this.serverAddress + '/api/auth/logout', httpOptions).pipe(
      tap(() => {
        this.updateLoginStatus(false)
      }),
      catchError(this.handleError<any>('logout'))
    )
  }

  /**
   * 
   * @returns whether a user is logged in or not
   */
  isLoggedIn() {
    return this.loggedInSignal();
  }

  /**
   * updates logged in signal with given value
   * @param value the value to be updated
   */
  updateLoginStatus(value: boolean) {
    this.loggedInSignal.set(value)
  }

}
