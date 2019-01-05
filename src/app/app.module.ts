import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule,routingComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './service/auth.service';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './admin/_layout/sidebar/sidebar.component';
import { HeaderComponent } from './admin/_layout/header/header.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { FooterComponent } from './client/_layout/footer/footer.component';
import { TopbarComponent } from './client/_layout/topbar/topbar.component';
import { PageService } from './service/page.service';
import { FaqService } from './service/faq.service';
import { HomeService } from './service/home.service';
import { BannerService } from './service/banner.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {FileValidator} from './provider/file-input.validator';
import {FileValueAccessor} from './provider/file-control-value-accessor'
import { UserService } from './service/user.service';
import { DriverService } from './service/driver.service';
import { VehicleService } from './service/vehicle.service';
import { RidesService } from './service/rides.service';
import { ChartsModule } from 'ng2-charts';
import { CollapseModule, BsDropdownModule } from 'ngx-bootstrap';
import { DriverFooterComponent } from './client/_layout/driver-footer/driver-footer.component';
import { HelpDriverComponent } from './client/help-driver/help-driver.component';
import { SettlementService } from './service/settlement.service';
import { DriverHeaderComponent } from './client/_layout/driver-header/driver-header.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    TopbarComponent,
    FileValidator,
    FileValueAccessor,
    DriverFooterComponent,
    HelpDriverComponent,
    DriverHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule, 
    CKEditorModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    ChartsModule,
    CollapseModule.forRoot(), BsDropdownModule.forRoot(),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [AuthService, AuthGuard,PageService,FaqService,
  HomeService,BannerService,UserService,DriverService,VehicleService,RidesService,SettlementService],
  bootstrap: [AppComponent]
})
export class AppModule { }
