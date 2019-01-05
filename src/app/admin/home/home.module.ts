import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { HomeService } from '../../service/home.service';
import { DriverComponent } from './driver/driver.component';
import { AddDriverComponent } from './add-driver/add-driver.component';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { UpdateComponent } from './update/update.component'

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    CKEditorModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule.forRoot(),
  ],
  declarations: [AddComponent, ViewComponent, EditComponent,  DriverComponent, 
    AddDriverComponent,UpdateComponent],
  providers: [HomeService],
})
export class HomeModule { }
