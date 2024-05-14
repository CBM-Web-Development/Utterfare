import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAuthUser } from '../../lib/interfaces/iauth-user';
import { Subscription, take } from 'rxjs';
import { AuthenticationService } from '../../lib/services/authentication/authentication.service';
import { IProfile } from '../../lib/interfaces/iprofile';
import { IFeedItem } from '../../lib/interfaces/ifeed-item';
import { Store } from '@ngrx/store';
import { userAuthSelect } from '../../lib/stores/UserAuth/userauth.selector';
import { ProfileService } from '../../lib/services/profile/profile.service';
import { IVendorItemReview } from '../../lib/interfaces/ivendor-item-review';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy{
  validated$ = new Subscription();
  isLoadingProfile = true; 
  isLoadingReviews = true; 
  isLoadingProfile$ = new Subscription();
  isLoadingReviews$ = new Subscription();
  feedItems: IFeedItem[] = [];
  reviews: IVendorItemReview[] = [];
  username: string = '';

  profile: IProfile = {
    id: -1,
    userId: -1,
    emailAddress: ''
  };

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
  
  @ViewChild('loginModal') loginModal!: TemplateRef<any>;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private authService: AuthenticationService,
    private store: Store,
    private profileService: ProfileService,
    private modalService: NgbModal
  ){}

  ngOnInit(): void {

    this.username = this.activatedRoute.snapshot.paramMap.get('username') ?? '';
    this.activatedRoute.paramMap.subscribe( res => {
      this.username = res.get('username') ?? '';
      this.loadProfile();
    })

    
  }

  loadProfile(){
    this.isLoadingProfile$ = this.profileService.isLoadingProfile$.subscribe( res => {
      this.isLoadingProfile = res;
    });

    this.isLoadingReviews$ = this.profileService.isLoadingReviews$.subscribe( res => {
      this.isLoadingReviews = res;
    });

    this.store.select(userAuthSelect).subscribe( authUserRes => {
      this.authUser = authUserRes;    

      this.profileService.getProfile(this.username!).pipe( take(1) ).subscribe( res => {
        this.profile = res;
        if(this.authUser.auth.id !== 0){
          this.profileService.getReviews(this.profile.id).pipe( take(1) ).subscribe( (res: IFeedItem[]) => {
            this.feedItems = res;
          });
        }
      });

    });
  }

  displayLoginModal(){
    this.modalService.open(this.loginModal);
  }

  signIn(event: Event){
    console.log(event);
    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    this.validated$.unsubscribe();
    this.isLoadingProfile$.unsubscribe();
    this.isLoadingReviews$.unsubscribe();
  }
}
