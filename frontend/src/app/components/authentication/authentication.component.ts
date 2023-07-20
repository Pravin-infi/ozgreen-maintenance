import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  result: any;

  constructor(private api: ApiService, private toastr: ToastrService, private router: Router,private builder: FormBuilder, ) {}
  
  verifyform = this.builder.group({
    code: this.builder.control('', Validators.required)
  });

  ngOnInit() {  
    
  }

  proceedVerify(){
    let paylod: any = {
      userid: sessionStorage.getItem('userid'),
      code: this.verifyform.value.code
    }

    this.api.postRequest('auth/emailVerify', paylod ).subscribe((item: any) => {      
      this.result = item; 
      if (this.result) {
        sessionStorage.setItem('access_token',this.result.token);
        sessionStorage.setItem('username',this.result.username);
        sessionStorage.setItem('userid',this.result.userid);
        this.router.navigate(['home']);

      } else {
        this.toastr.error('Some thing is wrong');
      }
    },()=> {        
      this.toastr.warning('Please enter valid data.')
    });
  }

}
