import { Injectable } from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/reduce';

import {Ticket, User} from '../../models/ticket';
import {BackendService} from '../../services/backend.service';

@Injectable()
export class UsersFacade {
  allUsers$ : Observable<User[]> = this.backend.users();
  constructor(private backend: BackendService) { }

  /**
   * Update tickets with Avatar image URLs
   */
  updateWithAvatars(tickets$:Observable<Ticket[]>):Observable<Ticket[]> {
    return Observable
        .combineLatest(tickets$, this.allUsers$)
        .map( updateAllTickets );

  }

  findUserById(userId: string): Observable<User> {
    const findUser = (acc, it) => acc ? acc : ((it.id == userId) ? it : null);
    return this.allUsers$.reduce(findUser);
  }
}

/**
 *  Iterator function used to update ticket::imageURL properties
 *  based on userId == assigneeId
 */
export function updateAllTickets([tickets, users]): Ticket[] {
  const lookupUser = findUserBy(users);
  tickets.forEach(t => {
    const user = lookupUser(t.assigneeId);
    t.imageURL = user ? user.imageURL : '';
    return t;
  });

  return tickets;
}

function findUserBy(users) {
  return (id) => {
    return users.reduce((found, user)=>{
      return found || ((user.id == id) ? user : null);
    },null);
  };
}
