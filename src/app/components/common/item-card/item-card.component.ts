import { Component, Input } from '@angular/core';
import { ISearchResult } from '../../../lib/interfaces/isearch-result';
import { getCurrencySymbol } from '../../../lib/utils/currency';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss'
})
export class ItemCardComponent {

  @Input('menuItem') menuItem!: ISearchResult

  constructor(){}


  currencySymbol(currency: string): string{
    return getCurrencySymbol(currency);
  }

  updateUrl(event: any){ 
    event.target!.setAttribute('src', '/assets/images/Logo.png');
    event.target!.width = '200';
  }

}
