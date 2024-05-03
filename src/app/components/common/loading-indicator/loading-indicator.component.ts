import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.scss'
})
export class LoadingIndicatorComponent implements OnInit, AfterViewInit {
  @Input('isLoading') isLoading?: boolean;
  @Input('position') position?: string;

  @ViewChild('loadingIndicator') loadingIndicator!: ElementRef

  constructor(){}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    
    if(this.position !== undefined && this.position !== null){
      this.loadingIndicator?.nativeElement.classList.add('center');
    }
    if(this.isLoading !== undefined){
      this.loadingIndicator.nativeElement.setAttribute('hidden', !this.isLoading);
    }
  }

  
}
