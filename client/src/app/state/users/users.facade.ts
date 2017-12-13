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

  /**
   * Special accessor used by both TicketsFacade (forkJoin)
   * and UsersActionTypes.LOADALL
   */
  getUsers(): Observable<User[]> {
    return this.backend.users()
        .do(users => {
          const usersLoaded = new UsersLoadedAction(users)
          this.store.dispatch(usersLoaded);
        });
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

  @Effect({dispatch:false})
  getUsers$ = this.actions$
    .ofType(UsersActionTypes.LOADALL)
    .pipe(
      withLatestFrom(this.loaded$),
      switchMap(([_, loaded]) => {
        return loaded ? of(null) : this.getUsers();
      })
    );

}

