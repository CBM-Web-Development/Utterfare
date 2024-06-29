import { HttpInterceptorFn } from '@angular/common/http';
import { IAuthUser } from '../interfaces/iauth-user';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const user = localStorage.getItem('authUser') ??  null; 
  
  if( user !== null ){
    const userObj: IAuthUser = JSON.parse(user);

    const token = userObj.auth.token;
    const contentType = req.url.indexOf('/media/upload') > -1 ? 'multipart/form-data' : 'application/json';

    const modifiedReq = req.clone({
      headers: req.headers.append("Authorization", `Bearer ${token}`).append('ContentType', contentType),
    });

    return next(modifiedReq);
  }

  return next(req);
};
