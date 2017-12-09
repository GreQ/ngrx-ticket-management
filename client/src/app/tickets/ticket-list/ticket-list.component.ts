import {Component} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import {Ticket} from '../../models/ticket';
import {TicketsFacade} from '../../state/tickets/tickets.facade';
import {UsersFacade} from '../../state/users/users.facade';

@Component({
  selector: 'ticket-list',
  styleUrls : [ './ticket-list.component.css' ],
  template: `      
    <mat-nav-list>
      <h2 matSubheader> {{pendingOnly ? 'Pending' : 'All' }} Tickets </h2>
      <mat-slide-toggle 
          [checked]="showAll" 
          (change)="toggleShowAll($event.checked)">
        Show All
      </mat-slide-toggle>
      
      <ticket-search 
        [criteria]="searchCriteria" 
        (search)="updateSearchBy($event)">
      </ticket-search>
      
      <a *ngFor="let ticket of (tickets$ | async); trackBy: trackByFn"
         mat-list-item 
         title="{{ticket.title}}"
         [routerLink]="['/ticket', ticket.id]" >
        <img mat-list-avatar class="circle"
             [src]="ticket.imageURL" 
             alt="Picture of {{ticket.assigneeId}}" >  
        <p mat-line 
           [ngClass]="{'completed': ticket.completed}">
          {{ticket.title | truncate: 30}}
        </p>
      </a>
      
    </mat-nav-list>
   `
})
export class TicketListComponent {
  showAll          = true;
  searchCriteria   = '';
  tickets$         = this.srvTickets.filteredTickets$;

  constructor(private srvTickets:TicketsFacade){ }

  trackByFn(ticket:Ticket)        { return ticket.id;  }
  toggleShowAll(showAll:boolean)  { this.showAll = showAll;         this.updateFilters();  }
  updateSearchBy(criteria:string) { this.searchCriteria = criteria; this.updateFilters();  }

  private updateFilters() { this.srvTickets.filter( this.searchCriteria, this.showAll );   }
}

