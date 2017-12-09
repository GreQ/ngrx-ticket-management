import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TruncatePipe } from './utils/truncate';
import { Backend } from './services/backend.service';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, TruncatePipe],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [Backend],
  bootstrap: [AppComponent]
})
export class AppModule {}
