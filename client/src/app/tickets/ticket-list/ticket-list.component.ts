import {Component} from '@angular/core';
import {transition, trigger, animate, keyframes, style, query} from '@angular/animations';

import {Ticket} from '../../models/ticket';
import {TicketsFacade} from '../../state/tickets/tickets.facade';

@Component({
  selector: 'ticket-list',
  styleUrls : [ './ticket-list.component.css' ],
  animations : [
      trigger('row', [
        transition(':enter', [
          animate('525ms cubic-bezier(0.4, 0.0, 0.2, 1)', keyframes([
              style({minHeight:'0px', overflow:'hidden', height:'0px', opacity:0 }),
              style({minHeight:'*', overflow:'inherit', height:'*', opacity: 1})
           ]))
        ]),
      ]),
    trigger('listChange', [
      transition(':increment', [
        query(':enter',[
          animate('525ms cubic-bezier(0.4, 0.0, 0.2, 1)', keyframes([
              style({minHeight:'0px', overflow:'hidden', height:'0px', opacity:0 }),
              style({minHeight:'*', overflow:'inherit', height:'*', opacity: 1})
           ]))
        ]),
      ]),
    ])

  ],
  template: `      
    <mat-nav-list [@listChange]="numTickets">
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
         @row
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
  numTickets       = 0;
  tickets$         = this.srvTickets.filteredTickets$;


  constructor(private srvTickets:TicketsFacade){
     this.tickets$.subscribe(tickets => {
       this.numTickets = tickets.length
     });
  }

  trackByFn(ticket:Ticket)        { return ticket.id;  }
  toggleShowAll(showAll:boolean)  { this.showAll = showAll;         this.updateFilters();  }
  updateSearchBy(criteria:string) { this.searchCriteria = criteria; this.updateFilters();  }

  private updateFilters() { this.srvTickets.filter( this.searchCriteria, this.showAll );   }
}

