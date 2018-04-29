import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { reduce, tap } from 'rxjs/operators';

import { User} from '@nrwl-tickets/users-models';
import { BackendService } from '@nrwl-tickets/tickets-backend';

import { UsersQuery } from './users.selectors';
import { UsersLoadedAction } from './users.actions';
import { UsersState } from './users.reducers';

@Injectable({
  providedIn : 'root'
})
export class UsersFacade {
  allUsers$ = this.store.select(UsersQuery.getUsers);

  constructor(
    private actions$: Actions,
    private store: Store<UsersState>,
    private backend: BackendService
  ) {}

  // **************************************************
  //  Public Methods
  //  **************************************************

  /**
   * Special accessor used by both TicketsFacade (forkJoin)
   * and UsersActionTypes.LOADALL
   */
  getUsers(): Observable<User[]> {
    return this.backend.users().pipe(
      tap(users => {
        const usersLoaded = new UsersLoadedAction(users);
        this.store.dispatch(usersLoaded);
      })
    );
  }

  /**
   *
   */
  findUserById(userId: string): Observable<User> {
    const findUser = (acc, it) => (acc ? acc : it.id == userId ? it : null);
    return this.allUsers$.pipe(reduce(findUser));
  }
}
