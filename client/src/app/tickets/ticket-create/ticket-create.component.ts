import {animate, keyframes, style, transition, trigger} from '@angular/animations';
import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {users} from '../../../../../server/contacts';

import {TicketsFacade} from '../../state/tickets/tickets.facade';
import {Ticket, User} from '../../models/ticket';
import 'rxjs/add/observable/of';
import {UsersFacade} from '../../state/users/users.facade';
import {updateWithAvatar, updateWithAvatars} from '../../utils/avatars';

@Component({
  selector: 'ticket-creator',
  styleUrls: [ './ticket-create.component.css' ],
  animations : [
      trigger('card', [
        transition(':enter', [
          style({opacity:0}),
          animate('500ms', style({opacity:1}))
        ])
      ])
  ],
  template: `      
      <div fxLayout fxLayoutAlign="center center" class="centered" @card>
        <ticket-card  [ticket$]="ticket$" [users$]="users$" 
                      (save)="save($event)"
                      (reassign)="reassign($event)"
                      (cancel)="cancel($event)" >
        </ticket-card>
      </div>
   `
})
export class TicketCreatorComponent {
  users$  : Observable<User[]> = this.service.users$;
  ticket$ = this.makeNewTicket();

  constructor(
      public service: TicketsFacade,
      public users : UsersFacade,
      public router:Router) {  }

  save(ticket:Ticket) {
    this.service.save(ticket);
    this.ticket$ = this.makeNewTicket();
  }

  cancel(ticket:Ticket) {
    this.router.navigate(['/ticket', "1"]);
  }

  /**
   * Special user assignment without persistence
   */
  reassign(ticket:Ticket) {
    const watch = this.users$.subscribe(users => {
      ticket = updateWithAvatar(ticket, users);
      this.ticket$ = Observable.of(ticket);
    });
    watch.unsubscribe();
  }

  private makeNewTicket():Observable<Ticket> {
    return Observable.of( {
              id : '',
              title : '',
              description : '',
              assigneeId : '',
              completed : false,
              imageURL : '/assets/todoAvatar.png'
           } as Ticket);
  }
}


