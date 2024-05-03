import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAuthUser } from '../../lib/interfaces/iauth-user';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../lib/services/authentication/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy{
  validated$ = new Subscription();
  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private authService: AuthenticationService
  ){}

  ngOnInit(): void {
    const authUser: IAuthUser = JSON.parse(localStorage.getItem('authUser') ?? '{}');
    const activatedUserId = this.activatedRoute.snapshot.paramMap.get('username');
    console.log(activatedUserId);
    if( activatedUserId !== undefined && activatedUserId !== null){
      this.validated$ = this.authService.validateToken(authUser.auth).subscribe(response => {
        if (response === false){
          this.router.navigate(['/','login']);
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.validated$.unsubscribe();
  }
}
