import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {EffectsModule} from '@ngrx/effects';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {CommonStateModule} from '@nrwl-tickets/common/state';

import {NxModule} from '@nrwl/nx';

import {CommonUiMaterialModule} from '@nrwl-tickets/common-ui-material';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routes.module';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonUiMaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    NxModule.forRoot(),

    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],

    AppRoutingModule,
    CommonStateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
