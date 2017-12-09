import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Ticket, User } from '../models/ticket';

const ROOT_URL = 'http://localhost:3000';

@Injectable()
export class BackendService {
  constructor(private http: HttpClient) {}

  tickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${ROOT_URL}/api/tickets`);
  }

  ticket(id: string) {
    return this.http.get<Ticket>(`${ROOT_URL}/api/ticket/${id}`);
  }

  users(): Observable<Array<User>> {
    return this.http.get<User[]>(`${ROOT_URL}/api/users`);
  }

  user(id: string) {
    return this.http.get<User>(`${ROOT_URL}/user/${id}`);
  }

  newTicket(payload: {
    title: string;
    description?: string;
    assigneeId?: string;
  }): Observable<Ticket> {
    return this.http.post<Ticket>(`${ROOT_URL}/api/tickets`, payload);
  }

  assign(ticketId: string, assigneeId: string) {
    return this.http.post<Ticket>(`${ROOT_URL}/api/assign`, {
      ticketId,
      assigneeId
    });
  }

  complete(ticketId: string, completed: boolean = true): Observable<Ticket> {
    return this.http.post<Ticket>(`${ROOT_URL}/api/complete`, {
      ticketId,
      completed
    });
  }
}

/**
 * Add REST API error retries...
 */
// function addRetry(source$:Observable<any>,api:string = ''):Observable<any> {
//     return source$.pipe(
//         catchError(err => empty() ),
//         retryWhen( errors$ => {
//             return errors$.pipe(
//                       do( err => console.log(`${api} error = ${err}` ) ),
//                       delay(1000)
//                   );
//         })
//     )
// }

/**
 * Inject User link into Tickets [using assigneeId]
 */
function injectUsers([tickets, users]) {
  const lookupUser = findUserBy(users);
  tickets.forEach(t => (t.user = lookupUser(t.assigneeId)));

  return tickets;
}

/**
 *
 */
export function findUserBy(users) {
  return id => {
    return users.reduce((found, user) => {
      return found || (user.id == id ? user : null);
    }, null);
  };
}

/**
 * Reducer fucntion
 */
export function findTicketBy(ticketId) {
  return (seed, ticket) =>
    seed ? seed : ticket.id == ticketId ? ticket : null;
}
