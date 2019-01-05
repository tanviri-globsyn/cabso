import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '../../../service/page.service';
import { FormGroup,  FormBuilder,  Validators, FormArray, NgForm,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Location } from '@angular/common';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  page: any;
  Form: FormGroup;
  constructor(private route: ActivatedRoute,
     private router: Router,
     private service: PageService, private fb: FormBuilder,
     public toastr: ToastsManager, vcr: ViewContainerRef,private location: Location
    ) {
      this.toastr.setRootViewContainerRef(vcr);
    this.createForm();
   }

  createForm() {
    this.Form = this.fb.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(3),Validators.maxLength(30)])],
      content: ['', Validators.required ],
      pagetype:[''],
   });
  }

  updatePage(page) {
    this.route.params.subscribe(params => {
    this.service.updatePage(page, params['id']);
    sessionStorage.setItem("SuccessMessage", "Help Page Content Updated Successfully");  
   // this.router.navigate(['/admin/page/view']);
    window.scrollTo(0, 0);
    this.location.back();
  });
}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.page = this.service.editPage(params['id']).subscribe(res => {
        this.page = res;
      });
    });
  }
}