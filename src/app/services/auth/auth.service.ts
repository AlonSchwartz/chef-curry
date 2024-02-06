import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, effect, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
    let userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      //this.loggedIn = JSON.parse(userInfo).loggedIn;
      //this.signalTest(this.loggedIn);
      this.updateLoginStatus(true);
    }
  }
  private serverAddress: string = "http://localhost:9001"; //for local server


  // private loggedIn = false;
  loggedInSignal = signal(false);

  register(email: string, password: string): Observable<any> {

    const headers = new HttpHeaders({
      'Accept': '/', // Replace with your actual access token
    });

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };

    const requestOptions = {
      headers: headers,
    }

    console.log("Starting to register")
    let registrationSuccessful = false;
    const userData = {
      email: email,
      password: password
    }


    console.log("i am about to send data to server")

    return this.http.post(this.serverAddress + '/api/auth/register', userData, httpOptions).pipe(
      tap(() => {
        this.updateLoginStatus(true);
      }),
      catchError(this.handleError<any>('Registration'))
    )
  }


  login(email: string, password: string): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer yourAccessToken', // Replace with your actual access token
    });


    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true

    };
    console.log("Starting to login")

    //send data to server. 
    // if login is successfull, return true and notify the other components that the user is logged in.
    // The components that needs to know are mainly the toolbar and recipe
    const userData = {
      email: email,
      password: password
    }
    console.log("will it send?")

    return this.http.post(this.serverAddress + '/api/auth/login', userData, httpOptions).pipe(
      tap(res => {
        console.log(res)
        // this.loggedIn = true;
        //this.signalTest(this.loggedIn)
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
      // console.log(error)
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
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
        message: message, //error.error.message
        successfull: false
      }
      console.log(error)
      // Let the app keep running by returning an empty result.
      return of(msg as T);
    };
  }

  testAuth(recipe: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true

    };

    return this.http.post(this.serverAddress + '/api/auth/save', recipe, httpOptions).pipe(
      catchError(this.handleError<any>('test'))
    )
  }

  validateStoredTokens(email: string) {
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

  logout() {
    const httpOptions = {
      withCredentials: true
    };

    return this.http.delete(this.serverAddress + '/api/auth/logout', httpOptions).pipe(
      tap(res => {
        console.log(res)
        // this.loggedIn = false;
        this.updateLoginStatus(false)
      }),
      catchError(this.handleError<any>('logout'))
    )
  }

  isLoggedIn() {
    //return this.loggedIn;
    return this.loggedInSignal();
  }

  updateLoginStatus(value: boolean) {
    this.loggedInSignal.set(value)
  }

}
