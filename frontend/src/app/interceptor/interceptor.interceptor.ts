import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {
 

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = sessionStorage.getItem('access_token')
    const copiedReq = request.clone({
      headers: request.headers.set(
        'authorization', 'Bearer ' + token
      )
    });
    
    if (!token) {
      this.router.navigateByUrl('login');
    }

    return next.handle(copiedReq);
    // console.log(token);
    
    // return next.handle(request);
  }
}
