import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactModel } from '../../models/contact-model'

import { NinjaService } from '../../services/ninja.service';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

  @ViewChild('reCaptchaRef') reCaptcha: RecaptchaComponent;
  contact = new ContactModel();
  submitButton: boolean = true;

  constructor(private ninjaService: NinjaService) { }

  ngOnInit() {
  }

  sendRequest() {
    this.ninjaService.sendContactRequest(this.contact)
      .then(success => alert('You\'re contact message has been sent.'));
  }

  resolved(captchaResponse: string) {
    if (captchaResponse === null) {
      this.reCaptcha.reset();
      return;
    }

    this.submitButton = false;
    this.contact.captchaResponse = captchaResponse;
  }

}
