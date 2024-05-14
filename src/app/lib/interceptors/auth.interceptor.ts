import { HttpInterceptorFn } from '@angular/common/http';
import { IAuthUser } from '../interfaces/iauth-user';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const user = localStorage.getItem('authUser') ??  null; 

  if( user !== null ){
    const userObj: IAuthUser = JSON.parse(user);

    const token = userObj.auth.token;

    const modifiedReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`),

    });

    return next(modifiedReq);
  }
  return next(req);
};
