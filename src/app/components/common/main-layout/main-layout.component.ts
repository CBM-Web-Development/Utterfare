import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../lib/interfaces/iuser';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  isLoggedIn = false; 
  currentUser: IUser = {}

  constructor(){}
  
  ngOnInit(){}
}
