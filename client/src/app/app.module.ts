import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';

import {AppComponent} from './app.component';

import {TruncatePipe} from './utils/truncate';
import {BackendService} from './services/backend.service';
import {TicketFacade} from './state/facade';


@NgModule({
  declarations: [
    AppComponent,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
  ],
  providers: [BackendService, TicketFacade],
  bootstrap: [AppComponent]
})
export class AppModule {  }
