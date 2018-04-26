import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { reduce, tap } from 'rxjs/operators';

import { ApplicationState } from '../app.state';

import { UsersQuery } from './users.reducers';
import { User } from '../../models/ticket';
import { UsersLoadedAction } from './users.actions';
import { BackendService } from '../../services/backend.service';

@Injectable()
export class UsersFacade {
  allUsers$ = this.store.select(UsersQuery.getUsers);

  constructor(
    private actions$: Actions,
    private store: Store<ApplicationState>,
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
