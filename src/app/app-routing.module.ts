import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { IndexComponent } from './client/index/index.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './admin/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './service/auth.service';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { HelpComponent } from './client/help/help.component';
import { ContactComponent } from './client/contact/contact.component';
import { DriverComponent } from './client/driver/driver.component';
import { HelpDriverComponent } from './client/help-driver/help-driver.component';

const routes: Routes = [

  { path:'',
    component:ClientComponent,
   children:[
     { path:'', redirectTo:'index', pathMatch:'full'},
     { path:'index', component:IndexComponent},
     { path:'help/:id',  component:HelpComponent},
     { path:'helpDriver/:id',  component:HelpDriverComponent},
     { path:'contact',  component:ContactComponent},
     { path:'driver', component:DriverComponent},
     {
      path: 'faq',
      loadChildren: './client/faq/faq.module#FaqModule'
    },
   ]
  },
 { path:'login', component:LoginComponent},
  {
    path:'admin',
    component:AdminComponent,
    canActivate:[AuthGuard],
    children:[
      { path: '', redirectTo:'dashboard', pathMatch:'full'},
      { path:'dashboard', component:DashboardComponent},
      { path:'login', component:LoginComponent},
  
      {
        path: 'user',
        loadChildren: './admin/user/user.module#UserModule'
      },
      {
        path: 'page',
        loadChildren: './admin/pages/pages.module#PagesModule'
      },
      {
        path: 'home',
        loadChildren: './admin/home/home.module#HomeModule'
      },
      {
        path: 'banner',
        loadChildren: './admin/banner/banner.module#BannerModule'
      },
      {
        path: 'faq',
        loadChildren: './admin/faq/faq.module#FaqModule'
      },
      {
        path: 'bodytype',
        loadChildren: './admin/cab/bodytypes/bodytypes.module#BodytypesModule'
      },
      {
        path: 'amenities',
        loadChildren: './admin/cab/amenities/amenities.module#AmenitiesModule'
      },
      {
        path: 'category',
        loadChildren: './admin/cab/category/category.module#CategoryModule'
      },

      {
        path: 'management',
        loadChildren: './admin/management/management.module#ManagementModule'
      },

      {
        path: 'commissions',
        loadChildren: './admin/commissions/commissions.module#CommissionsModule'
      },
    ]
  }
 

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
 
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponent = [ClientComponent,IndexComponent,AdminComponent,
  DashboardComponent,LoginComponent,HelpComponent,ContactComponent,DriverComponent
]
