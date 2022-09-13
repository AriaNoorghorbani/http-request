import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  error = new Subject<string>();

  createAndStorePost(title: string, content: string){
    const postData: post = {title: title, content: content};
    this.http
    .post<{name: string}>(
      'https://ng-complete-guide-278d1-default-rtdb.firebaseio.com/posts.json',
      postData
      ).subscribe(responseData => {
      console.log(responseData)
    }, error => {
      this.error.next(error.message)
    });
  }

  fetchPost(){
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key')

    return this.http
    .get<{ [key: string]: post }>(
      'https://ng-complete-guide-278d1-default-rtdb.firebaseio.com/posts.json', 
      {
        headers: new HttpHeaders({'custom-Header': 'Hello'}),
        params: searchParams
      }
      )
    .pipe(
      map(responseData => {
        const postArray: post[] = [];
        for(const key in responseData){
          if(responseData.hasOwnProperty(key)){
            postArray.push({ ...responseData[key], id: key });
          }
        }
        return postArray;
      }),
      catchError(errorRes => {
        return throwError(errorRes)
      })
    )
  }

  deletePost(){
    return this.http.delete('https://ng-complete-guide-278d1-default-rtdb.firebaseio.com/posts.json')
  }
}
