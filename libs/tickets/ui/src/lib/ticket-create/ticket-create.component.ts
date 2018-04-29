import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Ticket } from '@nrwl-tickets/tickets-models';
import { User} from '@nrwl-tickets/users-models';
import { TicketsFacade} from '@nrwl-tickets/tickets-state';
import { UsersFacade } from '@nrwl-tickets/users-state';

import { updateWithAvatar } from '@nrwl-tickets/common-utils';

@Component({
  selector: 'ticket-creator',
  styleUrls: ['./ticket-create.component.css'],
  animations: [
    trigger('card', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ])
    ])
  ],
  template: `      
      <div fxLayout fxLayoutAlign="center center" class="centered" @card>
        <ticket-card  [ticket]="ticket" 
                      [users]="users$ | async" 
                      (save)="save($event)"
                      (reassign)="reassign($event)"
                      (cancel)="cancel($event)" >
        </ticket-card>
      </div>
   `
})
export class TicketCreatorComponent {
  users$: Observable<User[]> = this.service.users$;
  ticket: Ticket = makeNewTicket();

  constructor(
    public service: TicketsFacade,
    public users: UsersFacade,
    public router: Router
  ) {}

  save(ticket: Ticket) {
    this.service.save(ticket);
    this.ticket = makeNewTicket();
  }

  cancel(ticket: Ticket) {
    this.router.navigate(['/ticket', '1']);
  }

  /**
   * Special user assignment without persistence
   */
  reassign(ticket: Ticket) {
    const watch = this.users$.subscribe(users => {
      ticket = updateWithAvatar(ticket, users);
      this.ticket = ticket;
    });
    watch.unsubscribe();
  }
}

function makeNewTicket(): Ticket {
  return {
    id: '',
    title: '',
    description: '',
    assigneeId: '',
    completed: false,
    imageURL: '/assets/todoAvatar.png'
  };
}
