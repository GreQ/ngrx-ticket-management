import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ticketsReducer, INITAL_STATE } from './+state/tickets.reducers';
import { TicketsFacade } from './+state/tickets.facade';
import { TicketsEffects } from './+state/tickets.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('tickets', ticketsReducer ),
    EffectsModule.forFeature([TicketsEffects])
  ],
  providers: [TicketsFacade]
})
export class TicketsStateModule {}
