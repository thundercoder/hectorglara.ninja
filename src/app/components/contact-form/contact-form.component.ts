import { Component, OnInit } from '@angular/core';
import { ContactModel } from '../../models/contact-model'

import { NinjaService } from '../../services/ninja.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

  public declarativeFormCaptchaValue: string;
  contact = new ContactModel();

  constructor(private ninjaService: NinjaService) { }

  ngOnInit() {
  }

  sendRequest() {
    this.ninjaService.sendContactRequest(this.contact)
      .then(success => alert('nice'));
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
  }

}
