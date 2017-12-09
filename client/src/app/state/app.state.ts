import { ActionReducerMap } from '@ngrx/store';

import { ticketsReducer, TicketsState } from './tickets/tickets.reducers';
import { usersReducer, UsersState } from './users/users.reducers';

/**
 * By default ngrx will use `combineReducers()` with the reducer map to
 * compose a single root reducer. When providing an array of meta-reducers ngrx
 * will take the reducer map together with the meta-reducers to compose them from
 * right to left to form a root meta-reducer. In other words, we end up having one
 * root reducer which will first call the meta-reducers and finally call `combineReducers`
 * to compute the next state.
 */

export interface ApplicationState {
  tickets: TicketsState;
  users: UsersState;
}

export const ROOT_REDUCER: ActionReducerMap<ApplicationState> = {
  tickets: ticketsReducer,
  users: usersReducer
};
