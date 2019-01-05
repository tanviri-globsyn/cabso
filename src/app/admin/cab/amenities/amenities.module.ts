import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmenitiesRoutingModule } from './amenities-routing.module';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { AmenitiesService } from '../../../service/amenities.service';
import {ToastModule} from 'ng2-toastr/ng2-toastr';

@NgModule({
  imports: [
    CommonModule,
    AmenitiesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule.forRoot(),
  ],
  declarations: [AddComponent, ViewComponent, EditComponent],
  providers: [AmenitiesService],
})
export class AmenitiesModule { }
