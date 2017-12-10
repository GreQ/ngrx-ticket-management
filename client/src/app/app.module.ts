import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {APP_ROUTES} from './app.routes';
import {MaterialModule} from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';

import {AppComponent} from './app.component';
import {UsersFacade} from './state/users/users.facade';
import {TicketDashboardComponent} from './tickets/ticket-dashboard/ticket-dashboard.component';
import {TicketListComponent} from './tickets/ticket-list/ticket-list.component';
import {TicketEditorComponent} from './tickets/ticket-editor/ticket-editor.component';
import {TicketCardComponent} from './tickets/ticket-card/ticket-card.component';
import {TicketSearchComponent} from './tickets/ticket-search/ticket-search.component';

import {TruncatePipe} from './utils/truncate';
import {BackendService} from './services/backend.service';
import {TicketsFacade} from './state/tickets/tickets.facade';

@NgModule({
  declarations: [
    AppComponent,
    TicketDashboardComponent,
    TicketListComponent,
    TicketEditorComponent,
    TicketCardComponent,
    TicketSearchComponent,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forRoot(APP_ROUTES),
  ],
  providers: [BackendService, TicketsFacade, UsersFacade],
  bootstrap: [AppComponent]
})
export class AppModule {  }
