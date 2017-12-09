import { Component } from '@angular/core';

@Component({
  selector: 'ticket-app',
  styleUrls: ['./app.component.css'],
  template: `      
    <div class="mat-elevation-z2">
      <mat-toolbar color="tickets" >
          <i class="material-icons gap" style="color:white;font-size: 36px">assignment</i>
          <span class="appTitle">Todo Tickets</span>
          <div fxFlex></div>
          <a [routerLink]="['/tickets/grid']">
          <i class="material-icons gap" style="color:white;font-size: 36px">list</i>
          </a>
          <img src="/assets/nrwl_logo.png" style="transform: scale(0.75)">
      </mat-toolbar>
    </div>
    <router-outlet></router-outlet>
   
   `
})
export class AppComponent {}
