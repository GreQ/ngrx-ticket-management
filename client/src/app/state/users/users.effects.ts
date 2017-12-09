import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { of } from 'rxjs/observable/of';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { User } from '../../models/ticket';
import { UsersQuery } from './users.reducers';
import { UsersActionTypes, UsersLoadedAction } from './users.actions';

import { ApplicationState } from '../app.state';
import { BackendService } from '../../services/backend.service';

@Injectable()
export class UsersEffects {
  /**
   * Used to internal throttle the LoadAllTickets requests
   */
  loaded$ = this.store.select(UsersQuery.getLoaded);

  @Effect({ dispatch: false })
  getUsers$ = this.actions$.ofType(UsersActionTypes.LOADALL).pipe(
    withLatestFrom(this.loaded$),
    switchMap(([_, loaded]) => {
      return loaded ? of(null) : this.getUsers();
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<ApplicationState>,
    private backend: BackendService
  ) {}

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
}
