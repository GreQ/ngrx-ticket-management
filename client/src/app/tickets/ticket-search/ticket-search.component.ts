import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ticket-search',
  styleUrls: ['./ticket-search.component.css'],
  template: `      
        <mat-icon class="search-icon">search</mat-icon>
          <input matInput placeholder="Search"
                 #filter fxFlex="auto"
                 [value]="criteria" 
                 (input)="search.emit(filter.value)" >
        <button mat-icon-button class="clear-btn"
                *ngIf="filter.value"
                (click)="clearCriteria()" >
          <mat-icon>clear</mat-icon>
        </button>
   `
})
export class TicketSearchComponent {
  @Input() criteria: string = '';
  @Output() search = new EventEmitter<string>();

  clearCriteria() {
    this.criteria = '';
    this.search.emit('');
  }
}
