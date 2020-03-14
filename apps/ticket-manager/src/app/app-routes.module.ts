import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: '@nrwl-tickets/tickets-ui#TicketsUiModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
        routes,
        {initialNavigation: true}
    )
  ],
  exports: [
      RouterModule
  ]
})
export class AppRoutingModule { }
