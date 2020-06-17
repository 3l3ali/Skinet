import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor { // MUST ADD TO PROVIDERS IN APP.MODULE

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      catchError(error => {
        if (error){
          if (error.status === 400){
            if (error.error.errors){
              throw error.error;
            } else {
              this.toastr.error(error.error.message, error.error.statusCode);
            }
          }
          if (error.status === 401){
            this.toastr.error(error.error.message, error.error.statusCode);
          }
          if (error.status === 404){
            this.router.navigateByUrl('/not-found');
          }
          if (error.status === 500){
            const navigationExtras: NavigationExtras = {state: {error: error.error}}; // to send the extra error info with the router
            this.router.navigateByUrl('/server-error', navigationExtras);
          }
        }
        return throwError(error);
      })
    );
  }

}
