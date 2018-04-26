import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { ROOT_REDUCER } from './state/app.state';
import { TicketCreatorComponent } from './tickets/ticket-create/ticket-create.component';
import { TicketDashboardComponent } from './tickets/ticket-dashboard/ticket-dashboard.component';
import { TicketGridComponent } from './tickets/ticket-grid/ticket-grid.component';
import { TicketListComponent } from './tickets/ticket-list/ticket-list.component';
import { TicketEditorComponent } from './tickets/ticket-editor/ticket-editor.component';
import { TicketCardComponent } from './tickets/ticket-card/ticket-card.component';
import { TicketSearchComponent } from './tickets/ticket-search/ticket-search.component';

import { TruncatePipe } from './utils/truncate';

import { BackendService } from './services/backend.service';
import { TicketsEffects } from './state/tickets/tickets.effects';
import { UsersEffects } from './state/users/users.effects';
import { TicketsFacade } from './state/tickets/tickets.facade';
import { UsersFacade } from './state/users/users.facade';

import { APP_ROUTES } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    TicketDashboardComponent,
    TicketListComponent,
    TicketGridComponent,
    TicketEditorComponent,
    TicketCardComponent,
    TicketSearchComponent,
    TicketCreatorComponent,
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
    StoreModule.forRoot(ROOT_REDUCER),
    EffectsModule.forRoot([TicketsEffects, UsersEffects])
  ],
  providers: [BackendService, TicketsFacade, UsersFacade],
  bootstrap: [AppComponent]
})
export class AppModule {}
