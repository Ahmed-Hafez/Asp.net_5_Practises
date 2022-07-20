import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse) {
          switch (errorResponse.status) {
            case 400:
              if (errorResponse.error.errors) {
                const modalStateErrors = [];
                for (const error of errorResponse.error.errors) {
                  modalStateErrors.push(error);
                }

                throw modalStateErrors.flat();
              } else if (typeof errorResponse.error === 'object') {
                this.toastr.error(
                  errorResponse.statusText,
                  errorResponse.status.toString()
                );
              } else {
                this.toastr.error(
                  errorResponse.error,
                  errorResponse.status.toString()
                );
              }
              break;

            case 401:
              this.toastr.error(
                errorResponse.statusText,
                errorResponse.status.toString()
              );
              break;

            case 404:
              this.router.navigateByUrl('/not-found');
              break;

            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: errorResponse.error },
              };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;

            default:
              this.toastr.error('Something unexpected went wrong');
              console.error(errorResponse);
              break;
          }
        }
        return throwError(() => errorResponse);
      })
    );
  }
}
