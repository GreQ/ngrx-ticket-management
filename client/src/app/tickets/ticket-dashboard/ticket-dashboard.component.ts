import { Component } from '@angular/core';
import {TicketsFacade} from '../../state/tickets/tickets.facade';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';

@Component({
  selector: 'ticket-dashboard',
  styleUrls: [ './ticket-dashboard.component.css' ],
  template: `      
    <mat-drawer-container class="example-container" >
      <mat-drawer mode="side" opened="true" class="mat-elevation-z2">
        <ticket-list></ticket-list>
      </mat-drawer>
      <mat-drawer-content>
        <div *ngIf="(loaded$ | async); else loading">
          <mat-progress-bar
              *ngIf="(processing$ | async)"
              mode="indeterminate" color="warn"></mat-progress-bar>
          <router-outlet >
            <!-- Dynamic views here -->
          </router-outlet>
        </div>
        <p class="copyright">Copyright 2017, All Rights Reserved - Nrwl, Inc.</p>
      </mat-drawer-content>
    </mat-drawer-container>
    <ng-template #loading>
      <mat-spinner class="nrwl"></mat-spinner>   
    </ng-template>
   `
})
export class TicketDashboardComponent {
  loaded$ = this.tickets.allTickets$.filter( value => !!value.length);
  processing$ = this.tickets.processing$;

  constructor(public tickets: TicketsFacade) {   }
}
