import { Component, OnInit, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AmenitiesService } from '../../../../service/amenities.service';
import { FormGroup, FormBuilder, Validators, FormArray, NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  @ViewChild('image') image;
  amenities: any;
  Form: FormGroup;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: AmenitiesService,
    private fb: FormBuilder,
    private elem: ElementRef,
    public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.createForm();
    this.toastr.setRootViewContainerRef(vcr);
  }

  createForm() {
    this.Form = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      image: [''],
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.amenities = this.service.edit(params['id']).subscribe(res => {
        this.amenities = res;
      });
    });
  }

  update(Form) {
    this.route.params.subscribe(params => {
      this.service.updatePage(Form, params['id']).subscribe(data => {
        if (data.success) {
          sessionStorage.setItem("SuccessMessage", data.msg);
          // this.getContent();
          this.router.navigate(['admin/amenities/view']);
        }

        if (data.error) {
          this.toastr.error(data.msg);

        }
      });
      //   }
    });
  }


  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'png') {
      return true;
    }
    else if (ext.toLowerCase() == 'jpeg') {
      return true;
    } else if (ext.toLowerCase() == 'jpg') {
      return true;
    } else {
      return false;
    }
  }


}