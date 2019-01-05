import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommissionsRoutingModule } from './commissions-routing.module';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { CommissionsService } from '../../service/commissions.service';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CommissionsRoutingModule,
    FormsModule, ReactiveFormsModule,
    ToastModule.forRoot(),
  ],
  declarations: [AddComponent, ViewComponent, EditComponent],
  providers: [CommissionsService],
})
export class CommissionsModule { }
