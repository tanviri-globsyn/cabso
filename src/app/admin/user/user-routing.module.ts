import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailComponent } from './email/email.component';
import { SocialComponent } from './social/social.component';
import { WebsiteComponent } from './website/website.component';
import { LogoComponent } from './logo/logo.component';
import { PasswordComponent } from './password/password.component';
import { MobileappComponent } from './mobileapp/mobileapp.component';
import { PaymentComponent } from './payment/payment.component';
import { FaviconComponent } from './favicon/favicon.component';

const routes: Routes = [
  {
    path: '',
    children: [
         {
        path: 'email',
        component: EmailComponent,
       
      },
      {
        path: 'sociallink',
        component: SocialComponent,
       
      },
      {
        path: 'website',
        component: WebsiteComponent,
       
      },
      {
        path: 'logo/:id',
        component: LogoComponent,
       
      },
      {
        path: 'password/:id',
        component: PasswordComponent,
      },
      {
        path: 'app',
        component: MobileappComponent,
      },

      {
        path: 'payment',
        component: PaymentComponent,
      },
      {
        path: 'favicon/:id',
        component: FaviconComponent,
       
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
