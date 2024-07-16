import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAuthUser } from '../../lib/interfaces/iauth-user';
import { Subscription, take } from 'rxjs';
import { userAuthSelect } from '../../lib/stores/UserAuth/userauth.selector';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IProfile } from '../../lib/interfaces/iprofile';
import { EditProfileService } from '../../services/edit-profile/edit-profile.service';
import { MediaService } from '../../services/media/media.service';
import { updateUserAuth, updateUserAuthProfile } from '../../lib/stores/UserAuth/userauth.actions';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit, OnDestroy {
  isLoadingProfile = false; 
  isLoadingProfile$ = new Subscription();
  profilePictureLoading$ = new Subscription();
  profilePictureLoading = false;
  authUser$ = new Subscription();
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
  }

  profile: IProfile = {
    id: 0,
    userId: 0,
    emailAddress: '',
    profilePicture: '', 
    firstName: '',
    lastName: ''
  };

  profileFormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required]),
    profilePicture: new FormControl(''),
    birthday: new FormControl(new Date(), [Validators.required]),
    gender: new FormControl(''),
  });

  preferencesFormGroup = new FormGroup({});

  constructor(
    private store: Store,
    private router: Router,
    private editProfileService: EditProfileService,
    private mediaService: MediaService,
  ){}

  ngOnInit(): void {
  
    this.profilePictureLoading$ = this.editProfileService.isLoadingProfilePicture$.subscribe( res => {
      this.profilePictureLoading = res;
    });

    this.profileFormGroup.controls.profilePicture.valueChanges.subscribe( val => this.profile.profilePicture = val ?? '');
    this.profileFormGroup.controls.firstName.valueChanges.subscribe( val => this.profile.firstName = val ?? '');
    this.profileFormGroup.controls.lastName.valueChanges.subscribe( val => this.profile.lastName = val ?? '');
    this.profileFormGroup.controls.birthday.valueChanges.subscribe( val => this.profile.birthday = val ?? new Date());
    this.profileFormGroup.controls.emailAddress.valueChanges.subscribe( val => this.profile.emailAddress = val ?? '');
    this.profileFormGroup.controls.phoneNumber.valueChanges.subscribe( val => this.profile.phoneNumber = val ?? '');
  
    this.authUser$ = this.store.select(userAuthSelect).subscribe( (authUserRes: IAuthUser) => {
      if(authUserRes.profile.id === 0){
        this.router.navigate(['/','login']);
      }else {
        this.authUser = authUserRes;
        this.setControls(this.authUser);
      }
    });
  }

  setControls(authUser: IAuthUser){
    console.log(authUser);
    this.profile = { 
      id: authUser.profile.id,
      userId: authUser.profile.userId,
      emailAddress: authUser.profile.emailAddress,
      profilePicture: authUser.profile.profilePicture, 
      firstName: authUser.profile.firstName,
      lastName: authUser.profile.lastName,
      phoneNumber: authUser.profile.phoneNumber,
      birthday: authUser.profile.birthday
    }; 

    this.profileFormGroup.controls.profilePicture.setValue(this.profile.profilePicture ?? '');
    this.profileFormGroup.controls.firstName.setValue(this.profile.firstName! ?? '');
    this.profileFormGroup.controls.lastName.setValue(this.profile.lastName ?? '');
    this.profileFormGroup.controls.birthday.setValue(this.profile.birthday ?? new Date());
    this.profileFormGroup.controls.emailAddress.setValue(this.profile.emailAddress ?? '');
    this.profileFormGroup.controls.phoneNumber.setValue(this.profile.phoneNumber ?? '');
  }

  handleFileUpload(event: Event){

    const file = (event.target as HTMLInputElement).files![0];
    if(file !== undefined){
      this.editProfileService.uploadProfilePicture(this.authUser.auth.id, file).pipe( take(1) ).subscribe( res => {
        //this.profile.profilePicture = res.url;
        this.profileFormGroup.controls.profilePicture.setValue(res.url!);
        console.log(this.profileFormGroup.dirty);
      });
    }
  }

  saveProfileChanges(){
    this.editProfileService.saveProfileChanges(this.profile).pipe( take(1) ).subscribe( res => {
      console.log(res);
      //this.authUser.profile = res;
      localStorage.setItem('authUser', JSON.stringify(this.authUser));
      this.store.dispatch(updateUserAuthProfile({profile: res}));
      this.setControls(this.authUser);
    });
  }

  ngOnDestroy(): void {
    this.authUser$.unsubscribe();
    this.profilePictureLoading$.unsubscribe();
  }
}
