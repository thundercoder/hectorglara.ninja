import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactModel } from '../../models/contact-model'

import { NinjaService } from '../../services/ninja.service';
import { RecaptchaComponent } from 'ng-recaptcha';

import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

  @ViewChild('reCaptchaRef') reCaptcha: RecaptchaComponent;
  contact = new ContactModel();
  submitButton: boolean = false;
  loadingVisible: boolean = false;

  constructor(private ninjaService: NinjaService) { }

  ngOnInit() {
  }

  sendRequest() {
    this.loadingVisible = true;

    this.ninjaService.sendContactRequest(this.contact)
      .then(success => {
        notify({
          message: 'You\'re contact message has been sent.',
          type: 'success',
          displayTime: 1500
        });

        this.cleanForm();
        this.loadingVisible = false;
      })
      .catch(err => this.loadingVisible = false);
  }

  cleanForm() : void {
    this.contact = { name: '', email: '', subject: '', message: '', captchaResponse: '' };
    this.submitButton = false;
  }

  resolved(captchaResponse: string) {
    if (captchaResponse === null) {
      return;
    }

    this.submitButton = true;
    this.contact.captchaResponse = captchaResponse;
  }

}
