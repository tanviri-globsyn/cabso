import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BannerRoutingModule } from './banner-routing.module';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { BannerService } from '../../service/banner.service';
import {ToastModule} from 'ng2-toastr/ng2-toastr';

@NgModule({
  imports: [
    CommonModule,
    BannerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule.forRoot(),
  ],
  declarations: [AddComponent, ViewComponent, EditComponent],
  providers: [BannerService],
})
export class BannerModule { }
