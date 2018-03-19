import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { NinjaService } from './services/ninja.service';
import { RecaptchaModule } from 'ng-recaptcha';
import { DxLoadPanelModule } from 'devextreme-angular';

@NgModule({
  declarations: [
    AppComponent,
    ContactFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RecaptchaModule.forRoot(),
    DxLoadPanelModule
  ],
  providers: [NinjaService],
  bootstrap: [AppComponent]
})
export class AppModule {


}
