import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  result: any;
  emailVerified: boolean = false;
  showVerificationMessage: boolean = false; // Add the emailVerified property

  constructor(private builder: FormBuilder, private router: Router, private api: ApiService, private toastr: ToastrService, ) { sessionStorage.clear(); }

  registrationForm = this.builder.group({
    username: this.builder.control('', Validators.required),
    name: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required),
    email: this.builder.control('', [Validators.required, Validators.email])

  });

  onSubmit() {
    
    let body: any= {
      username: this.registrationForm.value.username,
      password: this.registrationForm.value.password,
      email: this.registrationForm.value.email,
      name: this.registrationForm.value.name
    }
    if (this.registrationForm.valid) {
      console.log(body);
      this.api.postRequest('auth/signup', body).subscribe(item => {
        this.result = item;        
        if (this.result) {
          this.toastr.success('Registration successfully.')            
        }
      },error=> {        
        this.toastr.warning('Please enter valid data.')
      });
      
    }
  }

}
