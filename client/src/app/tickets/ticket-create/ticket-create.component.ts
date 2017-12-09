import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { ApplicationState } from '../../state/app.state';
import { SaveTicketAction } from '../../state/tickets/tickets.actions';

import { Ticket, User } from '../../models/ticket';
import { UsersQuery } from '../../state/users/users.reducers';
import { updateWithAvatar } from '../../utils/avatars';

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
  users$: Observable<User[]> = this.store.select(UsersQuery.getUsers);
  ticket: Ticket = makeNewTicket();

  constructor(public store: Store<ApplicationState>, public router: Router) {}

  save(ticket: Ticket) {
    this.store.dispatch(new SaveTicketAction(ticket));
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
