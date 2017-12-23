import {animate, style, transition, trigger} from '@angular/animations';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, merge } from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';

import {TicketsFacade} from '../../state/tickets/tickets.facade';
import {Ticket, User} from '../../models/ticket';

@Component({
  selector: 'ticket-editor',
  styleUrls: [ './ticket-editor.component.css' ],
  animations : [
      trigger('card', [
        transition(':enter', [
          style({opacity:0}),
          animate('700ms', style({opacity:1}))
        ])
      ])
  ],
  template: `      
      <div fxLayout fxLayoutAlign="center center" class="centered" @card>
        <ticket-card  [ticket]="ticket" 
                      [users]="users$ | async" 
                      (save)="service.save($event)"
                      (complete)="service.close($event)"
                      (reassign)="service.assign($event)" >
        </ticket-card>
      </div>
      <a mat-fab title="Add a new ticket" class="floating-button" routerLink="/ticket/new" >
        <mat-icon class="md-24">add</mat-icon>
      </a>
   `
})
export class TicketEditorComponent {
  users$  : Observable<User[]> = this.service.users$;
  ticket  : Ticket;

  constructor(public service: TicketsFacade, public route:ActivatedRoute) {
    this.watch = this.service.selectedTicket$.subscribe(ticket => this.ticket = ticket);
    makeTicketID$(route).subscribe(ticketId => this.service.select(ticketId));
  }

  ngOnDestroy() {
    this.watch.unsubscribe();
  }

  private watch : Subscription;
}


/**
 * For the current route and for future route changes, prepare an Observable to the route
 * params ticket 'id'
 */
function  makeTicketID$( route: ActivatedRoute ):Observable<string> {
  const current$ = of(route.snapshot.paramMap.get('id'));
  const future$ = route.params.pipe( map( params => params['id']));

  return current$.pipe(merge( future$ ));
}
