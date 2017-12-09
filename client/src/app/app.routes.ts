import { Routes } from '@angular/router';
import {TicketEditorComponent} from './tickets/ticket-editor/ticket-editor.component';

export const APP_ROUTES: Routes = [
  { path: 'ticket/:id', component: TicketEditorComponent },
  { path: '**', redirectTo: '/ticket/1' }
];

