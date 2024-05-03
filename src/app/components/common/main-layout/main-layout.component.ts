import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../lib/interfaces/iuser';
import { IAuthUser } from '../../../lib/interfaces/iauth-user';
import { Router, ActivatedRoute } from '@angular/router';

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
    private activatedRoute: ActivatedRoute
  ){}
  
  ngOnInit(){
    if(localStorage.getItem('authUser') !== null){
      this.authUser = JSON.parse(localStorage.getItem('authUser') ?? '{}');
      this.isLoggedIn = this.authUser.profile.id !== undefined && this.authUser.profile.id !== 0;
    }
  }

  toggleProfile(){
    if(this.isLoggedIn){
      this.hideDropdown = !this.hideDropdown;
    }else {
      this.router.navigate(['/','login'])
    }
  }

  logout(){
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
  }
}
