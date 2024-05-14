import { Component, Input, OnInit } from '@angular/core';
import { IVendorItemReview } from '../../../lib/interfaces/ivendor-item-review';
import { IFeedItem } from '../../../lib/interfaces/ifeed-item';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrl: './feed-item.component.scss'
})
export class FeedItemComponent implements OnInit {
  @Input() feedItem!: IFeedItem;
  rating = Array(5);

  constructor(){}

  ngOnInit(): void {
    
  }
}
