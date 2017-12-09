import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Ticket, User} from '../../models/ticket';

@Component({
  selector: 'ticket-card',
  styleUrls : [ './ticket-card.component.css'],
  template: `
      <mat-card class="ticket-card" *ngIf="(ticket$ | async) as ticket">
        <mat-card-title-group class="fullBleed">
          <mat-card-title class="title">
            Ticket <span style="font-size: 0.8em;">({{status(ticket)}})</span>
          </mat-card-title>
        </mat-card-title-group>
        <mat-card-content>
          <div class="avatar-container">
            <img [src]="ticket.imageURL || ''" class="avatar"/>
          </div>
          <form #editor="ngForm"
                (ngSubmit)="save.emit(editor.value);" 
                fxLayout="column">
            <mat-form-field class="userList">
              <mat-select placeholder="Assign to:"
                          name="assigneeId"
                          [ngModel]="ticket.assigneeId"
                          (selectionChange)="reassign.emit(editor.value)"
                          name="assigneeId" >
                <mat-option *ngFor="let it of (users$ | async)" [value]="it.id">
                  {{ it.name }}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field>
              <input matInput placeholder="Title" name="title" [ngModel]="ticket.title">
            </mat-form-field>
            <mat-form-field>
              <textarea rows="6" matInput placeholder="Description" name="description" 
                        [ngModel]="ticket.description"></textarea>
            </mat-form-field>
            <input name="id" [ngModel]="ticket.id" class="hidden">
          </form> 
        </mat-card-content>
        <mat-card-actions *ngIf="!ticket.completed">
          <div fxFlex></div>
          <button mat-button type="button" 
                  title="Mark as Completed"
                  (click)="complete.emit(ticket)">
              Complete
          </button>
          <button mat-button type="button" 
                  title="Save Ticket"
                  [disabled]="!editor.dirty"  
                  (click)="save.emit(editor.value)">
              Save
          </button>
        </mat-card-actions>  
      </mat-card>
   `
})
export class TicketCardComponent {
  @Input() users$  : Observable<User[]>;
  @Input() ticket$ : Observable<Ticket>;

  @Output() save     = new EventEmitter<Ticket>();
  @Output() reassign = new EventEmitter<string>();
  @Output() complete = new EventEmitter<Ticket>();

  status(ticket:Ticket):string {
    return ticket.completed ? 'finished' : 'pending';
  }
}
