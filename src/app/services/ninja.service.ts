import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { ContactModel } from '../models/contact-model';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import notify from 'devextreme/ui/notify';

@Injectable()
export class NinjaService {

  constructor(private http: HttpClient) {
  }

  private handleError(error: any, type: string, request?: any): Promise<any> {
    if (error.status == 422)
      notify({
        message: error.error[Object.keys(error.error)[0]].msg,
        type: 'error',
        displayTime: 1500
      });

    if (error.status == 400)
      notify({
        message: error.error,
        type: 'error',
        displayTime: 1500
      });

    console.log(error);
    return Promise.reject(error || error);
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
