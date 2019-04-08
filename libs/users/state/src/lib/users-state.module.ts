import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PersonSearchService } from './person-search';
import { usersReducer, INITAL_STATE, UsersFacade, UsersEffects } from './+state-users';
import { personsReducer, initialState, PersonsFacade, PersonsEffects } from './+state-persons';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('users', usersReducer, { initialState: INITAL_STATE }),
    StoreModule.forFeature('persons', personsReducer, {initialState}),
    EffectsModule.forFeature([UsersEffects, PersonsEffects])
  ],
  providers: [UsersFacade, PersonsFacade, PersonSearchService]
})
export class UsersStateModule {}
