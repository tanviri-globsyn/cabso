import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { PagesRoutingModule } from './pages-routing.module';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';
import { PageService } from '../../service/page.service';
import { Observable } from 'rxjs/Observable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { EditComponent } from './edit/edit.component';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { UserComponent } from './user/user.component';
import { UserPagesComponent } from './user-pages/user-pages.component';

@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    HttpClientModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    CKEditorModule,
    ToastModule.forRoot(),
  ],
 
  declarations: [AddComponent, ViewComponent, EditComponent, UserComponent, UserPagesComponent],
  providers: [PageService],
})
export class PagesModule { }
