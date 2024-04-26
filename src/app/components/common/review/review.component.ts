import { Component, Input } from '@angular/core';
import { IVendorItemReview } from '../../../lib/interfaces/ivendor-item-review';
import { IProfile } from '../../../lib/interfaces/iprofile';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
  @Input('review') review!: IVendorItemReview;
  @Input('isChild') isChild!: boolean;

  constructor(){}

  formatDisplayName(profile: IProfile): string{
    let displayName: string[] = [];
    if(profile.firstName !== undefined){
      displayName.push(profile.firstName);

      if(profile.lastName !== undefined){
        displayName.push(profile.lastName);
      }
    }else {
      displayName.push(profile.username ?? 'Utterfare Diner');
    }
    return displayName.join(' ');
  }

  formatDate(date: Date): string{
    date = new Date(date);
    const time = date.toLocaleString('en-US', {month:'long', year: 'numeric' , day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true});
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear;



    return time;
  }

}
