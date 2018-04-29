import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { of } from 'rxjs/observable/of';
import { switchMap, withLatestFrom } from 'rxjs/operators';


import { UsersQuery } from './users.selectors';
import { UsersState } from './users.reducers';
import { UsersActionTypes } from './users.actions';
import { UsersFacade } from './users.facade';

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
      return loaded ? of(null) : this.service.getUsers();
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<UsersState>,
    private service: UsersFacade
  ) {}
}
