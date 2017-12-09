import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators/filter';

import { BackendService } from '../../services/backend.service';
import { ApplicationState } from '../../state/app.state';
import { TicketsQuery } from '../../state/tickets/tickets.reducers';

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
  processing$ = this.store.select(TicketsQuery.isProcessing);
  loaded$ = this.store
    .select(TicketsQuery.getAllTickets)
    .pipe(filter(value => !!value.length));

  constructor(
    private store: Store<ApplicationState>,
    private backend: BackendService
  ) {}
}
