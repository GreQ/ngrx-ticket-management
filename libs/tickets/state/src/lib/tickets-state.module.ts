import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import {
  ticketsReducer,
  TicketsFacade,
  TicketsEffects
} from './+state-tickets';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('tickets', ticketsReducer ),
    EffectsModule.forFeature([TicketsEffects])
  ],
  providers: [TicketsFacade]
})
export class TicketsStateModule {}
