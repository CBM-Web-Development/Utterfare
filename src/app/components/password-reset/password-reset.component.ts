import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUser } from '../../lib/interfaces/iuser';
import { AuthenticationService } from '../../lib/services/authentication/authentication.service';
import { Subscription, take } from 'rxjs';
import { IErrorMessage } from '../../lib/interfaces/ierror-message';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})

export class PasswordResetComponent implements OnInit, AfterViewInit ,OnDestroy {
  user: IUser = {};
  isLoading$ = new Subscription();
  isLoading = false;
  errorMsg: IErrorMessage[] = [];
  errorMsg$ = new Subscription();

  resetRequestFormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required])
  });

  resetCodeFormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
  });

  passwordResetFormGroup = new FormGroup({
    password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(8)])
  });

  @ViewChild('resetRequestForm') resetRequestForm!: ElementRef;
  @ViewChild('resetCodeForm') resetCodeForm!: ElementRef;
  @ViewChild('passwordResetForm') passwordResetForm!: ElementRef;

  constructor(
    private authenticationService: AuthenticationService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute
  ){}

  ngOnInit(){
    this.isLoading$ = this.authenticationService.isLoading$.asObservable().subscribe(response => {
      this.isLoading = response;
    });

    this.resetRequestFormGroup.controls.username.valueChanges.subscribe( val => this.user.username = val ?? '');
    this.resetCodeFormGroup.controls.resetCode.valueChanges.subscribe( val => this.user.resetCode = val ?? 0 );
    this.passwordResetFormGroup.controls.password.valueChanges.subscribe( val => this.user.password = val ?? '');
    this.passwordResetFormGroup.controls.confirmPassword.valueChanges.subscribe(val => this.user.confirmPassword = val ?? '');
  }

  ngAfterViewInit(){}

  requestPasswordResetCode(){

    if(this.resetRequestFormGroup.invalid || this.user.username === null){
      this.errorMsg.push({code: 'username', content:'Username is required'})
      return;
    }
    
    this.authenticationService.passwordResetRequest(this.user.username!).pipe( take(1) ).subscribe( response => {
      this.resetRequestForm.nativeElement.style.display = 'none';
      this.resetCodeForm.nativeElement.style.display = 'block';
    }); 
    
  }

  validateCode(){
    if(this.resetCodeFormGroup.controls.resetCode.invalid || this.user.resetCode === null){
      this.errorMsg.push({code: 'reset code', content: 'Reset code is invalid'})
      return;
    }
    
    this.resetCodeFormGroup.controls.resetCode.disable();
    this.user.username = 'cottonmalone40';
    this.authenticationService.passwordResetCodeValidation(this.user.username!, this.user.resetCode!).pipe( take(1) ).subscribe( response => {
      if(response === true){
        this.resetCodeFormGroup.controls.resetCode.enable();
        this.resetCodeForm.nativeElement.style.display = 'none';
        this.passwordResetForm.nativeElement.style.display = 'block';
      }
    });    
  }

  resetPassword(){
    this.authenticationService.passwordReset(this.user).pipe( take(1) ).subscribe( response => {
      if (response === true){
        this.router.navigate(['/', 'login']);
      }
    })
  }

  ngOnDestroy(){
    this.isLoading$.unsubscribe();
  }

}
