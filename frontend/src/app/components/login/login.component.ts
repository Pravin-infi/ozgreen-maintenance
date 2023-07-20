import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private builder: FormBuilder, private router: Router, private api: ApiService, private toastr: ToastrService, ) { sessionStorage.clear(); }
  result: any;

  loginform = this.builder.group({
    username: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required)
  });

  proceedlogin() {
    
    let body: any= {
      username: this.loginform.value.username,
      password: this.loginform.value.password
    }
    if (this.loginform.valid) {
      this.api.postRequest('auth/login', body).subscribe(item => {
        this.result = item;        
        if (this.result) {
            sessionStorage.setItem('userid',this.result.userid);
            sessionStorage.setItem('usertype',this.result.usertype);
            if(this.result.usertype == 'user'){
              this.router.navigate(['authentication']);
            }
            else{              
              sessionStorage.setItem('access_token',this.result.token);
              sessionStorage.setItem('username',this.result.username);
              this.router.navigate(['home']);
            }
        }
      },error=> {        
        this.toastr.warning('Please enter valid data.')
      });
    }
  }

}
