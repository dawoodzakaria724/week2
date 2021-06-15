import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:5000/api/login';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const promise = this.http.post(this.apiUrl, {}).toPromise();
    console.log(promise);
    promise.then((data)=>{
      console.log("Promise resolved with: " + JSON.stringify(data));
    }, (error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    })
  }

/*   login():Observable<any>{
    return this.http.post('http://localhost:5000/api/login', {});
  } */

}
