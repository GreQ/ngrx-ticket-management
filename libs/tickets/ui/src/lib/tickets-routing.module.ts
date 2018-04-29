import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Ticket} from '@nrwl-tickets/tickets-models';

import {TicketCreatorComponent} from './ticket-create/ticket-create.component';
import {TicketDashboardComponent} from './ticket-dashboard/ticket-dashboard.component';
import {TicketEditorComponent} from './ticket-editor/ticket-editor.component';
import {TicketGridComponent} from './ticket-grid/ticket-grid.component';

export interface TicketsContext {
  tickets: Ticket[];
}

/**
 * Define title factory function in router definitions,
 * but support dynamic feature to show ticket count
 *
 * - Configured   in line 44 (below),
 * - Registered   in `custom-router-state.serializer`
 * - Used         in `tickets.effects.ts`
 */
export function buildTitle(context:TicketsContext) {
  const numTickets = context.tickets && context.tickets.length;
  return 'Tickets' + (numTickets ?  `(${numTickets})` : '');
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: TicketDashboardComponent,
        children: [
          {
            path: '',
            redirectTo: 'ticket/1',
            pathMatch: 'full'
          },
          {
            path: 'tickets/grid',
            component: TicketGridComponent,
            data: { title: buildTitle }
          },
          {
            path: 'ticket/new',
            component: TicketCreatorComponent,
            pathMatch: 'full'
          },
          {
            path: 'ticket/:id',
            component: TicketEditorComponent
          },
          {
            path: '**',
            redirectTo: '/ticket/1'
          }
        ]
      }
    ])
  ]
})
export class TicketsRoutingModule {
}

export const routedComponents = [
  TicketEditorComponent,
  TicketGridComponent,
  TicketDashboardComponent,
  TicketCreatorComponent
];
