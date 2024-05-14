import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../../lib/services/authentication/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../lib/interfaces/iuser';
import { take } from 'rxjs';
import { IErrorMessage } from '../../lib/interfaces/ierror-message';
import { Router } from '@angular/router';
import { IAuthUser } from '../../lib/interfaces/iauth-user';
import { Store } from '@ngrx/store';
import { setUserAuth } from '../../lib/stores/UserAuth/userauth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  user: IUser = {};
  errors: IErrorMessage[] = [];
  signInFormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  @Input() isModal = false;
  @Output() signInEmitter = new EventEmitter();
  
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private store: Store
  ){}

  ngOnInit(): void {
    const authUser: IAuthUser = JSON.parse(localStorage.getItem('authUser') ?? '{}');
    if(authUser.profile !== undefined && authUser.profile.id !== 0){
      this.router.navigate(['/', 'profile', authUser.auth.username])
    }
    this.signInFormGroup.controls.username.valueChanges.subscribe(val => this.user.username = val ?? '');
    this.signInFormGroup.controls.password.valueChanges.subscribe( val => this.user.password = val ?? '');
    
  }

  signIn(){
    this.errors = [];
    if(this.signInFormGroup.invalid){

      if(this.signInFormGroup.controls.username.invalid){
        this.errors.push({code: 'username', content: 'Username is required'})
      }

      if(this.signInFormGroup.controls.password.invalid){
        this.errors.push({code: 'password', content: 'Password is required'});
      }
      return; 
    }

    this.authenticationService.authenticate(this.user).pipe( take(1) ).subscribe( (response: IAuthUser) => {
      
      localStorage.setItem("authUser", JSON.stringify(response));
      this.store.dispatch(setUserAuth({payload: response}));
      if(this.isModal){
        this.signInEmitter.emit(true);
      } else {
        this.router.navigate(['/profile']);
      }
    })
  }

  errorExists(field: string){
    return this.errors.find(x => x.code === field);
  }

  getErrorMsg(key: string){
    return this.errors.find(x => x.code === key)?.content;
  }
}
