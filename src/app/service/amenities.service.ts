import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions,Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl+'/amenities';

@Injectable()
export class AmenitiesService {

  constructor(private http: HttpClient, private _http: Http) { }


  getContent() {
    return this
            .http
            .get(API_URL)
            .map(res => {
              return res;
            });
  }
  // public  add(formData: any ) {
  //   let _url: string = API_URL+'/add';
  //   return this._http.post(_url, formData)
  //   .catch(this._errorHandler)
  //   .map(res => {
  //     return res.json();
  //   });
  // }


  add(page) {
    const uri = API_URL+'/add';
    const obj = {
      name: page.name,
  };
   return  this._http.post(uri, obj)
   .map(res => {
    return res.json();
  });
  }
    
  private _errorHandler(error: Response) {
    console.error('Error Occured: ' + error);
    return Observable.throw(error || 'Some Error on Server Occured');
  
  }

  edit(id) {
    const uri = API_URL+'/edit/' + id;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }

  updatePage(formData: any, id) {
    const uri = API_URL+'/update/' + id;
   
    return  this
      ._http
      .post(uri, formData)
      .catch(this._errorHandler)
    .map(res => {
      return res.json();
    });
  }
  
  
  updatePageImage(formData: any, id) {
    let _url: string = API_URL+'/updateImage/' + id;   
    return this._http.post(_url, formData)
    .catch(this._errorHandler)
    .map(res => {
      return res.json();
    });
  }

  delete(id) {
    const uri = API_URL+'/delete/' + id;

        return this
            ._http
            .get(uri)
            .map(res => {
              return res.json();
            });
  }

}
