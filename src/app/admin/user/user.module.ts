import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { UserRoutingModule } from './user-routing.module';
import { EmailComponent } from './email/email.component';
import { SocialComponent } from './social/social.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlashMessagesModule } from 'ngx-flash-messages';
import { WebsiteComponent } from './website/website.component';
import { LogoComponent } from './logo/logo.component';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { PasswordComponent } from './password/password.component';
import { MobileappComponent } from './mobileapp/mobileapp.component';
import { PaymentComponent } from './payment/payment.component';
import { FaviconComponent } from './favicon/favicon.component';
@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    FlashMessagesModule,
     ToastModule.forRoot(),
  ],
  declarations: [EmailComponent, SocialComponent,  WebsiteComponent, LogoComponent, PasswordComponent, MobileappComponent, PaymentComponent, FaviconComponent]
})
export class UserModule { }
