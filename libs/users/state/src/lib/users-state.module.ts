import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { usersReducer, INITAL_STATE } from './+state/users.reducers';
import { UsersFacade } from './+state/users.facade';
import { UsersEffects } from './+state/users.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('users', usersReducer, {
      initialState: INITAL_STATE
    }),
    EffectsModule.forFeature([UsersEffects])
  ],
  providers: [UsersEffects, UsersFacade]
})
export class UsersStateModule {}
