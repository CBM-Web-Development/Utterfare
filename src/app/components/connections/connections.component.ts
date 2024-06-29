import { Component, Input, OnInit } from '@angular/core';
import { IProfileConnectionResponse } from '../../lib/interfaces/iprofile-connection-response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { IAuthUser } from '../../lib/interfaces/iauth-user';
import { IProfileConnection } from '../../lib/interfaces/iprofile-connection';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrl: './connections.component.scss'
})
export class ConnectionsComponent implements OnInit {
  
  @Input('connections') connections!: IProfileConnectionResponse[]
  @Input('title') title: string = 'Connections';

  constructor(
    private modalService: NgbModal,
    private store: Store
  ){}

  ngOnInit(): void {
    
  }

  parseDisplayName(connection: IProfileConnectionResponse): string{
    let displayName = ''; 
    
    if(connection.profile.firstName){
      displayName = connection.profile.firstName;

      if(connection.profile.lastName){
        displayName += ` ${connection.profile.lastName}`;
      }
    } else {
      displayName = `Utterfare User ${connection.profile.id}${connection.profile.userId}${connection.connection.id}${new Date(connection.connection.dateCreated!).getTime()}`;
    }


    return displayName;
  }

  handleImgError(event: ErrorEvent){
    const target: any = event.target; 
    target.setAttribute('src', '/assets/images/Logo.png');
    
  }
  
}
