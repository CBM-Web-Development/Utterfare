import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../lib/interfaces/iuser';
import { Subscription, take } from 'rxjs';
import { IErrorMessage } from '../../lib/interfaces/ierror-message';
import { SignUpService } from '../../services/sign-up/sign-up.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})

export class SignUpComponent implements OnInit, OnDestroy {
  isLoading = false;
  isLoading$ = new Subscription();
  errorMsg: IErrorMessage = {};
  errorMsg$ = new Subscription(); 

  newUser: IUser = {
    contactDetails: {}
  };
  signUpFormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required]), 
    emailAddress: new FormControl(null, [Validators.required, Validators.email]),
    phoneNumber: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [
      Validators.required, 
      Validators.minLength(8)
    ]),
    confirmPassword: new FormControl(null, [
      Validators.required, 
      Validators.minLength(8)
    ]),
  });

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private signUpService: SignUpService
  ){}

  ngOnInit(){
    this.signUpFormGroup.controls.username.valueChanges.subscribe(val => this.newUser.username = val ?? '');
    this.signUpFormGroup.controls.emailAddress.valueChanges.subscribe(val => this.newUser.contactDetails!.emailAddress = val ?? '');
    this.signUpFormGroup.controls.phoneNumber.valueChanges.subscribe(val => this.newUser.contactDetails!.phoneNumber = val ?? '');
    this.signUpFormGroup.controls.password.valueChanges.subscribe(val => this.newUser.password = val ?? '');

    this.isLoading$ = this.signUpService.isLoading$.asObservable().subscribe( response => {
      this.isLoading = response;
    });

    this.errorMsg$ = this.signUpService.errorMsg$.asObservable().subscribe( response => {
      this.errorMsg = response;
    })
  }

  signUp(){
    this.signUpService.signUp(this.newUser).pipe( take(1) ).subscribe( response => {
      if(response){
        this.router.navigate(['/','login'])
      }
    })
  }

  ngOnDestroy(){
    this.isLoading$.unsubscribe();
    this.errorMsg$.unsubscribe();
  }

}
