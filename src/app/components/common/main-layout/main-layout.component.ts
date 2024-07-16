import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../lib/interfaces/iuser';
import { IAuthUser } from '../../../lib/interfaces/iauth-user';
import { Router, ActivatedRoute } from '@angular/router';
import { props, select, Store } from '@ngrx/store';
import { resetUserAuth, setUserAuth } from '../../../lib/stores/UserAuth/userauth.actions';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  hideDropdown = true;
  isLoggedIn = false; 
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

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private store: Store<{userAuth: IAuthUser}>
  ){}
  
  ngOnInit(){
    this.authUser = JSON.parse(localStorage.getItem('authUser') ?? '{}');
    if(this.authUser !== null && this.authUser.profile.id !== undefined ){
      this.isLoggedIn = this.authUser.profile.id !== undefined && this.authUser.profile.id !== 0;
      this.store.dispatch(setUserAuth({payload: this.authUser}));
    }
  }

  toggleProfile(){
    
    if(this.isLoggedIn){
      this.hideDropdown = !this.hideDropdown;
    }else {
      this.hideDropdown = true;
      this.router.navigate(['/','login'])
    }
  }

  logout(){
    this.store.dispatch(resetUserAuth());
    localStorage.clear();
    this.isLoggedIn = false; 
    this.authUser = {
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
    }};
    this.router.navigate(['/','login']);
  }
}
