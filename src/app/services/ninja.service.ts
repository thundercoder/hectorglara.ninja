import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { ContactModel } from '../models/contact-model';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class NinjaService {

  constructor(private http: HttpClient) {
  }

  private handleError(error: any, type: string, request?: any): Promise<any> {
    if (error.status == 422)
      alert(error.error[Object.keys(error.error)[0]].msg);

    if (error.status == 400)
      alert(error.error);

    console.log(error);
    return Promise.reject(error.message || error);
  }

  sendContactRequest(contactModel: ContactModel) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');

    return this.http.post(`${environment.restApi}/send-email`, contactModel, { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(err => this.handleError(err, 'POST'));
  }
}
