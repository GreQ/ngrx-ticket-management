import { User } from '@nrwl-tickets/users-models';
import { UserActionsUnion, UsersActionTypes } from './users.actions';

export interface UsersState {
  loaded: boolean;
  selectedUserId: string | null;
  list: Array<User>;
}

export const INITAL_STATE: UsersState = {
  loaded: false,
  selectedUserId: null,
  list: []
};

// ***************************************************************
// Real Reducer
// ***************************************************************

export function usersReducer(
  state: UsersState = INITAL_STATE,
  action: UserActionsUnion
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

