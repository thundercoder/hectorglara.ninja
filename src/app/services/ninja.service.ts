import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { ContactModel } from '../models/contact-model';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class NinjaService {

  constructor(private http: HttpClient) {
  }

  private handleError(error: any, type: string, request?: any): Promise<any> {
    console.error('An error occurred: ', error);
    return Promise.reject(error.message || error);
  }

  sendContactRequest(contactModel: ContactModel) {
    return this.http.post(`${environment.restApi}/send-email`, contactModel)
      .toPromise()
      .then(response => response)
      .catch(err => this.handleError(err, 'GET'));
  }
}
