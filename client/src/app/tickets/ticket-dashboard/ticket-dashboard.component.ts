import { Component } from '@angular/core';
import { filter } from 'rxjs/operators/filter';
import { TicketsFacade } from '../../state/tickets/tickets.facade';

@Component({
  selector: 'ticket-dashboard',
  styleUrls: ['./ticket-dashboard.component.css'],
  template: `      
    <mat-drawer-container class="example-container" >
      <mat-drawer mode="side" opened="true" class="mat-elevation-z2">
        <ticket-list></ticket-list>
      </mat-drawer>
      <mat-drawer-content>
        <div *ngIf="(loaded$ | async); else loading" >
          <mat-progress-bar
              style="position: absolute"
              *ngIf="(processing$ | async)"
              mode="indeterminate" color="warn"></mat-progress-bar>
          <router-outlet >
            <!-- Dynamic views here -->
          </router-outlet>
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
    <ng-template #loading>
      <mat-spinner class="nrwl"></mat-spinner>   
    </ng-template>
   `
})
export class TicketDashboardComponent {
  loaded$ = this.tickets.allTickets$.pipe(filter(value => !!value.length));
  processing$ = this.tickets.processing$;

  constructor(public tickets: TicketsFacade) {}
}
