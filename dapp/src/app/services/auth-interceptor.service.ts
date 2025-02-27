import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { from, throwError } from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';

export const AuthInterceptorService: HttpInterceptorFn = (request, next) => {
  const authService = inject(SocialAuthService);

  if (
    request.url.startsWith('http://localhost:') ||
    request.url.startsWith('https://localhost:') ||
    request.url.startsWith('https://agentx') ||
    request.url.startsWith('https://api.agentx')
  ) {
    return from(authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID)).pipe(
      switchMap((token) => {
        request = request.clone({
          setHeaders: {
            authorization: `Bearer ${token || ''}`,
          },
        });
        return next(request);
      }),
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          authService.signOut();
        }
        return throwError(() => error);
      })
    );
  }

  return next(request).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.signOut();
      }
      return throwError(() => error);
    })
  );
};



// export const RequestLogInterceptorService: HttpInterceptorFn = (request, next) => {
//   const authService = inject(AuthService)

  
//   if(request.url.startsWith('https://localhost:') || request.url.startsWith('https://popcoin') ||  request.url.startsWith('https://api.popcoin')){
//     console.log('REQLOGGER:: request.url: ', request.url, new Date())
    
//   }
  


//   return next(request)
//     .pipe(catchError((error: any) => {

//       if (error instanceof HttpErrorResponse) {
//         if (error.status === 429) {
//           console.log('REQLOGGER:: 429 ERROR -RATE LIMIT: request.url: ', request.url, new Date())
//         }
//       }

//       return throwError(error);

//     }));
// };


