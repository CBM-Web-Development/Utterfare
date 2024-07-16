import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAuthUser } from '../../lib/interfaces/iauth-user';
import { Subscription, take } from 'rxjs';
import { userAuthSelect } from '../../lib/stores/UserAuth/userauth.selector';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditAccountService } from '../../services/edit-account/edit-account.service';
import { IErrorMessage } from '../../lib/interfaces/ierror-message';
import { UsernameValidator } from '../../lib/validators/username-validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrl: './edit-account.component.scss'
})
export class EditAccountComponent implements OnInit, OnDestroy {
  isLoadingPasswordUpdate = false; 
  isLoadingPasswordUpdate$ = new Subscription();
  isLoadingProfile = false; 
  isLoadingProfile$ = new Subscription();
  authStore$ = new Subscription();
  errors: IErrorMessage[] = [];
  error$ = new Subscription();
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  newUsername = '';

  authUser: IAuthUser = {
    auth: {
      id: 0,
      username: '',
      token: '',
      type: '',
      accountsId: []
    },
    profile: {
      id: 0,
      userId: 0,
      emailAddress: ''
    }
  };

  accountFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, UsernameValidator.cannotContainSpace]),
    type: new FormControl('', [Validators.required]),
    userId: new FormControl(0, [Validators.required])
  });

  passwordResetFormGroup = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  @ViewChild('passwordResetModal') passwordResetModal!: ElementRef<any>

  constructor(
    private store: Store,
    private modalService: NgbModal,
    private editAccountService: EditAccountService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.accountFormGroup.controls.username.setErrors({notUnique: true});
    this.passwordResetFormGroup.controls.currentPassword.valueChanges.subscribe(val => this.currentPassword = val ?? '');
    this.passwordResetFormGroup.controls.newPassword.valueChanges.subscribe(val => this.newPassword = val ?? '');
    this.passwordResetFormGroup.controls.confirmNewPassword.valueChanges.subscribe(val => {
      this.confirmNewPassword = val ?? ''
      this.isPasswordValid();
    });

    this.accountFormGroup.controls.username.valueChanges.subscribe( val => {
      this.newUsername = val ?? ''
      this.validateUsername();
    });

    
    this.error$ = this.editAccountService.error$.subscribe( res => {
      this.errors.push(res);
    });

    this.isLoadingProfile$ = this.editAccountService.isLoadingAccount$.subscribe( res => {
      this.isLoadingProfile = res;
    })

    this.authStore$ = this.store.select(userAuthSelect).subscribe( res => {
      if(res.auth.id === 0){
        this.router.navigate(['/', 'login']);
      }
      this.authUser = res;
      this.accountFormGroup.controls.username.setValue(res.auth.username);
      this.accountFormGroup.controls.userId.setValue(res.auth.id);
      this.accountFormGroup.controls.type.setValue(res.auth.type);
    });
    
  }

  openResetModal(){
    this.modalService.open(this.passwordResetModal)
  }

  savePassword(){
    this.editAccountService.updatePassword(this.authUser.auth.username, this.newPassword).pipe( take(1) ).subscribe( res => {
      this.modalService.dismissAll();
    });
  }
  
  saveUsername(){
    this.editAccountService.updateUsername(this.newUsername, this.authUser.auth.id).pipe( take(1) ).subscribe( res => {
      this.authUser.auth.username = this.newUsername;
    });
  }

  validateUsername(){
    if(this.newUsername !== this.authUser.auth.username){
      this.editAccountService.validateUsername(this.newUsername).pipe( take(1) ).subscribe( res => {
        console.log(res);
        if(res === false){
          this.accountFormGroup.controls.username.setErrors({invalidValue: true})
          this.errors.push({field: 'username', content: 'Username already exists'});
        } else {
          this.accountFormGroup.controls.username.setErrors(null);
          const index = this.errors.findIndex(x => x.field === 'username');
          this.errors.splice(index, 1);
        }
      })
    }
  }

  usernameIsInvalid(): boolean{
    return this.errors.findIndex(x => x.field === 'username') > -1;
  }

  isPasswordValid(): boolean{
    return this.confirmNewPassword === this.newPassword; 
  }

  ngOnDestroy(): void {
    this.authStore$.unsubscribe();
    this.error$.unsubscribe();
    this.isLoadingPasswordUpdate$.unsubscribe();
    this.isLoadingProfile$.unsubscribe();
  }


}
