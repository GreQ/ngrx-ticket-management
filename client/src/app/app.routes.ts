import { Routes } from '@angular/router';
import {TicketCreatorComponent} from './tickets/ticket-create/ticket-create.component';
import {TicketDashboardComponent} from './tickets/ticket-dashboard/ticket-dashboard.component';
import {TicketEditorComponent} from './tickets/ticket-editor/ticket-editor.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: TicketDashboardComponent,
    children: [
      { path: '', redirectTo: 'ticket/1', pathMatch:'full'     },
      { path: 'ticket/new', component: TicketCreatorComponent, pathMatch:'full'},
      { path: 'ticket/:id', component: TicketEditorComponent   },
      { path: '**', redirectTo: '/ticket/1' }
    ]
  },
  { path: '**', redirectTo: '/' }
];

