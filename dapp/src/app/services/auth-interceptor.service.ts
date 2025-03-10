import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { from, throwError } from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { UserService } from './user.service';

export const AuthInterceptorService: HttpInterceptorFn = (request, next) => {
  
  const userService = inject(UserService);

  // console.log("AUTHINTRC:: ", userService.isLoggedIn)

  if(userService.isLoggedIn && ( request.url.startsWith('http://localhost:') || request.url.startsWith('https://localhost:') || request.url.toLowerCase().startsWith('https://agentxapi.') ||  request.url.toLowerCase().startsWith('https://api.agentx.')) ) {
    
    request = request.clone({
      setHeaders: {
        'authorization': `Bearer ${userService.authToken || ''}`,
        // 'client-time': new Date().toISOString()
      }
    });
  }

  return next(request)
    .pipe(catchError((error: any) => {

      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          userService.logout();
        }
      }

      return throwError(error);

    }));

  
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


