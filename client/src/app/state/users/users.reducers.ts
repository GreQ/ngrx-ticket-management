import { createSelector } from '@ngrx/store';
import { ApplicationState } from '../app.state';

import { User } from '../../models/ticket';
import { UserActions, UsersActionTypes } from './users.actions';

export interface UsersState {
  loaded: boolean;
  selectedUserId: string | null;
  list: Array<User>;
}

const INITAL_STATE: UsersState = {
  loaded: false,
  selectedUserId: null,
  list: []
};

// ***************************************************************
// Real Reducer
// ***************************************************************

export function usersReducer(
  state: UsersState = INITAL_STATE,
  action: UserActions
): UsersState {
  switch (action.type) {
    case UsersActionTypes.USERS:
      const list = action.data;
      const loaded = true;

      state = { ...state, list, loaded };
      break;
  }

  return state;
}

// ***************************************************************
// Queries used by @ngrx Store
// ***************************************************************

export namespace UsersQuery {
  export const getUsers = (state: ApplicationState) => state.users.list;
  export const getLoaded = (state: ApplicationState) => state.users.loaded;
  export const getSelectedUserId = (state: ApplicationState) =>
    state.users.selectedUserId;
  export const getSelectedUser = createSelector(
    getUsers,
    getSelectedUserId,
    (users, id) => {
      let user = users.find(user => user.id == id);
      return user ? Object.assign({}, user) : undefined;
    }
  );
}
