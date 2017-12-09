import { Action } from '@ngrx/store';
import { User } from '../../models/ticket';

export const enum UsersActionTypes {
  USERS = '[users] list',
  LOADALL = '[users] loadAll',
  SELECT = '[user] select'
}

// ***************************************************************
// Request 'Actions'
// ***************************************************************

export class LoadAllUsersAction implements Action {
  readonly type = UsersActionTypes.LOADALL;
}
// ***************************************************************
// Document 'Action'
// ***************************************************************

export class UsersLoadedAction implements Action {
  readonly type = UsersActionTypes.USERS;
  constructor(public data: Array<User>) {}
}

export type UserActions = LoadAllUsersAction | UsersLoadedAction;
