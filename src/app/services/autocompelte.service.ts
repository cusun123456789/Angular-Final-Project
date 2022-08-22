import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutocompelteService {

  constructor(
    private http: HttpClient
  ) { }

  getUserName() {
    return this.http.get<any>("http://localhost:3000/Users/")
      .pipe(
        map((response: []) => response.map(item => item['userName']))
        )
  }
}
