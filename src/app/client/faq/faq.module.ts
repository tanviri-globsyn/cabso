import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq-routing.module';
import { ViewComponent } from './view/view.component';
import { ShowComponent } from './show/show.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FaqRoutingModule
  ],
  declarations: [ViewComponent, ShowComponent, FooterComponent, HeaderComponent]
})
export class FaqModule { }
