import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMenuItem } from '../../lib/interfaces/imenu-item';
import { IVendor } from '../../lib/interfaces/ivendor';
import { MenuItemService } from '../../lib/services/menu-item/menu-item.service';
import { Subscription, take } from 'rxjs';
import { IVendorItemReview } from '../../lib/interfaces/ivendor-item-review';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IMedia } from '../../lib/interfaces/imedia';
import { MediaService } from '../../lib/services/media/media.service';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent implements OnInit, OnDestroy {
  menuItem: IMenuItem = {};
  parsedReviews: IVendorItemReview[] = [];
  isReviewFormVisible = true;
  activeReview: IVendorItemReview = {};
  mediaIsLoading = false; 
  mediaIsLoading$ = new Subscription();
  
  @ViewChild('reviewForm') reviewForm!: ElementRef<HTMLFormElement>;
  @ViewChild('item_1') item_1?: ElementRef<HTMLImageElement>;
  @ViewChild('item_2') item_2?: ElementRef<HTMLImageElement>;
  @ViewChild('item_3') item_3?: ElementRef<HTMLImageElement>;
  @ViewChild('item_4') item_4?: ElementRef<HTMLImageElement>;
  @ViewChild('item_5') item_5?: ElementRef<HTMLImageElement>;

  itemReviewFormGroup = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
    rating: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5)]),
    media: new FormControl(null),
  }); 

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private toastr: ToastrService,
    private menuItemService: MenuItemService,
    private mediaService: MediaService
  ){}

  ngOnInit(): void {
    this.mediaIsLoading$ = this.mediaService.isLoading$.subscribe( isLoading => {
      this.mediaIsLoading = isLoading;
    });

    this.itemReviewFormGroup.controls.rating.valueChanges.subscribe(val => this.activeReview.rating = val ?? 0);
    this.itemReviewFormGroup.controls.title.valueChanges.subscribe(val => this.activeReview.title = val ?? '');
    this.itemReviewFormGroup.controls.content.valueChanges.subscribe(val => this.activeReview.content = val ?? '');

    const vendorSlug = this.activatedRoute.snapshot.paramMap.get('vendorSlug') ?? '';
    const itemSlug = this.activatedRoute.snapshot.paramMap.get('itemSlug') ?? '';
  
    this.menuItemService.getMenuItemBySlug(vendorSlug, itemSlug).pipe( take(1) ).subscribe( response => {
      this.menuItem = response;
        if(this.menuItem.itemReviews !== undefined){
        this.groupReviews(this.menuItem.itemReviews);
      }
    });
  }
    
  groupReviews(reviews: IVendorItemReview[]){
    let sortedReviews: IVendorItemReview[] = [];

    if (reviews.length > 0){
      
      // Add all parent level reviews
      reviews.forEach(review => {
        if (review.parent === undefined || review.parent === null) {
          sortedReviews.push(review);
        }
      });

      // Add all child reviews 
      reviews.forEach(review => {
        if(review.parent !== undefined && review.parent !== null){
          const index = sortedReviews.findIndex(x => x.id === review.parent) ?? -1;
          if(sortedReviews[index].children === undefined){
            sortedReviews[index].children = [];
          }
          sortedReviews[index].children?.push(review);
        }
      });

      this.parsedReviews = sortedReviews.sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime() );
    }
  }

  handleHover(index: number, item: HTMLImageElement){
    const image = item.getAttribute('src') ?? '';
    if(this.activeReview.rating === undefined){
      if(image.indexOf('artichoke-outline-0.png') > -1){
        item.setAttribute('src', 'assets/images/artichoke-outline.png');
      }else {
        for(var i = 1; i <= 5; i++){
          const item = document.getElementById(`item_${i}`);
          if(i <= index){
            item!.setAttribute('src', 'assets/images/artichoke-outline.png');
          }else {
            item!.setAttribute('src', 'assets/images/artichoke-outline-0.png');
          }
        }
      }
    }
  }
  
  setRatingImage(index: number): string {
    const currentRating = this.itemReviewFormGroup.controls.rating.value;
    if( currentRating === 0){
      
      return 'assets/images/artichoke-outline-0.png'
    } else if ( currentRating! >= index && currentRating! !== 0) {
      
      return 'assets/images/artichoke-outline.png'
    } else {
      
      return 'assets/images/artichoke-outline-0.png'
    }
  }

  calculatedRating(){
    
  }

  setRating(rating: number){
    this.itemReviewFormGroup.controls.rating.setValue(rating);
  }

  toggleReviewForm(){
    this.isReviewFormVisible = true;
    console.log(this.reviewForm);
    this.reviewForm.nativeElement.scrollIntoView();
  }

  toggleFilesUpload(fileInput: HTMLInputElement){
    fileInput.click();
  }

  onMediaPicked(event: Event){
    const files: File[] = Array.from((event.target as HTMLInputElement).files!);
    
    this.mediaService.uploadMediaFiles(files, 1).pipe( take(1) ).subscribe((response: IMedia[]) => {

      if(this.activeReview.tmpMedia === undefined){
        this.activeReview.tmpMedia = [];
      }

      
      this.activeReview.tmpMedia = this.activeReview.tmpMedia?.concat(response);

    });
  }

  removeMediaItem(id: number){
    const item = this.activeReview.media?.find(x => x === id);
    this.mediaService.removeMediaFile(id).pipe( take(1) ).subscribe( response => {
      if (response === true){
        this.activeReview.media = this.activeReview.media?.filter(x => x !== id);
      }
    })

  }

  submitReview(){
    if(!this.itemReviewFormGroup.valid){
      return;
    }

    this.activeReview.userId = 1;
    this.activeReview.itemId = this.menuItem.vendorItem!.id

    this.menuItem.itemReviews?.push(this.activeReview);
    this.menuItemService.saveReview(this.activeReview).pipe( take(1) ).subscribe( (response: IVendorItemReview) => {
      if(this.menuItem.itemReviews === undefined){
        this.menuItem.itemReviews = [];
      }
      this.menuItem.itemReviews?.push(response);
      console.log(this.menuItem.itemReviews);
      this.groupReviews(this.menuItem.itemReviews!);
      this.isReviewFormVisible = false;
    });
  }

  ngOnDestroy(): void {
    this.mediaIsLoading$.unsubscribe();
  }

}
