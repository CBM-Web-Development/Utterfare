import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAuthUser } from '../../lib/interfaces/iauth-user';
import { Subscription, take } from 'rxjs';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { IProfile } from '../../lib/interfaces/iprofile';
import { IFeedItem } from '../../lib/interfaces/ifeed-item';
import { Store } from '@ngrx/store';
import { userAuthSelect } from '../../lib/stores/UserAuth/userauth.selector';
import { ProfileService } from '../../services/profile/profile.service';
import { IVendorItemReview } from '../../lib/interfaces/ivendor-item-review';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IProfileConnectionResponse } from '../../lib/interfaces/iprofile-connection-response';

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
  followers: IProfileConnectionResponse[] = [];
  following: IProfileConnectionResponse[] = [];

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
  @ViewChild('followingModal') followingModal!: TemplateRef<any>;
  @ViewChild('followersModal') followersModal!: TemplateRef<any>;

  constructor(
    private activatedRoute: ActivatedRoute, 
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


        this.profileService.getFollowers(this.profile.id).pipe(take(1)).subscribe( res => {
          this.followers = res;
        });

        this.profileService.getFollowing(this.profile.id).pipe(take(1)).subscribe( res => {
          this.following = res;
        });

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
    this.modalService.dismissAll();
  }

  isFollowing(): boolean{
    return this.followers.findIndex(x => x.profile.id === this.authUser.profile.id) > -1;
  }

  isFriends(): boolean {
    return this.isFollowing() && this.following.findIndex( x=> x.profile.id === this.authUser.profile.id) > -1;
  }

  displayFollowing(){
    this.modalService.open(this.followingModal);
  }

  displayFollowers(){
    this.modalService.open(this.followersModal);
  }

  followProfile(){
    const profileId = this.profile.id;
    const followerId = this.authUser.profile.id;
    
    this.profileService.follow(profileId, followerId).pipe( take(1) ).subscribe(res => {
      const connection: IProfileConnectionResponse = {
        connection: res,
        profile: this.authUser.profile
      }
      this.followers.push(connection);
    })
  }

  unfollowProfile(){
    const profileId = this.profile.id;
    const followerId = this.authUser.profile.id;
    this.profileService.unfollow(profileId, followerId).pipe( take(1) ).subscribe( res => {
      this.followers = this.followers.filter(x => x.profile.id !== followerId );
    });
  }

  ngOnDestroy(): void {
    this.validated$.unsubscribe();
    this.isLoadingProfile$.unsubscribe();
    this.isLoadingReviews$.unsubscribe();
  }
}
