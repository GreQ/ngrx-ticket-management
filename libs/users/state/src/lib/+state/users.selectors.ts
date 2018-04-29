import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.reducers';

// ***************************************************************
//    Feature 'ticket' state definition (see users.reducer.ts):
//    This is the client-side, in-memory data structure used to manage state for
//    all user-related data.
//
//    export interface UsersState {
//     loaded         : boolean;
//     list           : Array<User>;
//     selectedUserId : string | null;
//    }
// ***************************************************************

/**
 * Get the feature 'store slice' state
 */
const getUsersState = createFeatureSelector<UsersState>('users');

// ***************************************************************
// Queries used by @ngrx Store
// ***************************************************************

const getUsers          = createSelector(getUsersState, state => state.list);
const getLoaded         = createSelector(getUsersState, state => state.loaded);
const getSelectedUserId = createSelector(getUsersState, state => state.selectedUserId);
const getSelectedUser   = createSelector(
  getUsers,
  getSelectedUserId,
  (users, id) => {
    let user = users.find(user => user.id == id);
    return user ? Object.assign({}, user) : undefined;
  }
);

export const UsersQuery = {
  getUsers,
  getLoaded,
  getSelectedUserId,
  getSelectedUser
};
