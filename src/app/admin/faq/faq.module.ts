import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { FaqRoutingModule } from './faq-routing.module';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { FaqService } from '../../service/faq.service';
import { Observable } from 'rxjs/Observable';
import {ToastModule} from 'ng2-toastr/ng2-toastr';


@NgModule({
  imports: [
    CommonModule,
    FaqRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    HttpClientModule,
    HttpModule,
    ToastModule.forRoot(),
  ],
  declarations: [AddComponent,  ViewComponent, EditComponent],
  providers: [FaqService],
})
export class FaqModule { }
