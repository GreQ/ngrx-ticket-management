import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import {Actions, Effect, ROOT_EFFECTS_INIT} from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, switchMap, withLatestFrom, reduce} from 'rxjs/operators';
import {users} from '../../../../../server/contacts';

import {NoopAction} from '../app.actions';
import {ApplicationState} from '../app.state';
import {LoadAllTicketsAction} from '../tickets/tickets.actions';
import {LoadAllUsersAction} from './users.actions';

import {UsersQuery} from './users.reducers';
import {Ticket, User} from '../../models/ticket';
import {UsersActionTypes, UsersLoadedAction} from './users.actions';
import {BackendService} from '../../services/backend.service';

@Injectable()
export class UsersFacade {
  allUsers$ = this.store.select(UsersQuery.getUsers);
  loaded$ = this.store.select(UsersQuery.getLoaded);

  constructor(
      private actions$: Actions,
      private store: Store<ApplicationState>,
      private backend: BackendService) {  }

  // **************************************************
  //  Public Methods
  //  **************************************************

  getUsers(): Observable<User[]> {
    this.store.dispatch(new LoadAllUsersAction());
    return this.allUsers$;
  }

  /**
   * Update tickets with Avatar image URLs
   */
  updateWithAvatars(tickets:Ticket[]):Ticket[] {
    this.allUsers$.subscribe(users => {
      const lookupUser = findUserBy(users);
      tickets.forEach(t => {
        const user = lookupUser(t.assigneeId);
        t.imageURL = user ? user.imageURL : '';
        return t;
      });
    }).unsubscribe();

    return tickets;
  }

  /**
   *
   */
  findUserById(userId: string): Observable<User> {
    const findUser = (acc, it) => acc ? acc : ((it.id == userId) ? it : null);
    return this.allUsers$.pipe(reduce( findUser ));
  }

  // **************************************************
  //  @ngrx Effects
  //  **************************************************

  @Effect()
  getUsers$ = this.actions$
    .ofType(UsersActionTypes.LOADALL)
    .pipe(
      withLatestFrom(this.loaded$),
      switchMap(([_, loaded]) => {
        return loaded ? of(null) : this.backend.users();
      }),
      map((users: Array<User> | null) => {
        return users ? new UsersLoadedAction(users) : new NoopAction();
      })
    );

}


// **************************************************
//  Private utils
//  **************************************************

  function findUserBy(users = []) {
    return (id) => {
      return users.reduce((found, user)=>{
        return found || ((user.id == id) ? user : null);
      },null);
    };
  }
