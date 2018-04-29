import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { CommonUiMaterialModule } from '@nrwl-tickets/common-ui-material';

import { TruncatePipe } from '@nrwl-tickets/common-utils';
import { TicketsStateModule } from '@nrwl-tickets/tickets-state';
import { UsersStateModule } from '@nrwl-tickets/users-state';

import { TicketCardComponent } from './ticket-card/ticket-card.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketSearchComponent } from './ticket-search/ticket-search.component';

import {
  routedComponents,
  TicketsRoutingModule
} from './tickets-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CommonUiMaterialModule,
    FlexLayoutModule,
    RouterModule,
    TicketsRoutingModule,
    TicketsStateModule,
    UsersStateModule
  ],
  declarations: [
    TruncatePipe,
    TicketListComponent,
    TicketSearchComponent,
    TicketCardComponent,
    routedComponents
  ]
})
export class TicketsUiModule {}
