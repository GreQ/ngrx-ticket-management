import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Ticket } from '@nrwl-tickets/tickets-models';
import { User} from '@nrwl-tickets/users-models';

@Component({
  selector: 'ticket-card',
  styleUrls: ['./ticket-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <mat-card class="ticket-card" *ngIf="ticket">
        <mat-card-title-group class="fullBleed" 
                              [ngClass]="{'create':!ticket.id, 'done':ticket.completed}">
          <mat-card-title class="title">
            {{ title(ticket) }}
          </mat-card-title>
        </mat-card-title-group>
        <mat-card-content>
          <form #editor="ngForm" novalidate
                (ngSubmit)="save.emit(editor.value);" 
                fxLayout="column">
            <mat-form-field class="userList">
              <mat-select placeholder="Assign to:"
                          name="assigneeId"
                          [disabled]="ticket.completed"
                          [ngModel]="ticket.assigneeId"
                          (selectionChange)="reassign.emit(editor.value)"
                          name="assigneeId" >
                <mat-option *ngFor="let it of users" [value]="it.id">
                  {{ it.name }}
                </mat-option>
              </mat-select>
              <div class="avatar-container">
                <img [src]="ticket.imageURL || ''" class="avatar"/>
              </div>
            </mat-form-field>
            <mat-form-field>
              <input matInput placeholder="Title" 
                     name="title" 
                     minlength="3" required
                     [disabled]="ticket.completed"
                     [ngModel]="ticket.title">
            </mat-form-field>
            <mat-form-field>
              <textarea matTextareaAutosize matAutosizeMinRows="2"
                        [disabled]="ticket.completed"
                        matInput placeholder="Description" name="description" 
                        [ngModel]="ticket.description"></textarea>
            </mat-form-field>
            <input name="id" [ngModel]="ticket.id" class="hidden">
          </form> 
        </mat-card-content>
        <mat-card-actions *ngIf="!ticket.completed">
          <div fxFlex></div>
          <button mat-button type="button" 
                  *ngIf="ticket.id"
                  title="Mark as Completed"
                  (click)="complete.emit(ticket)">
              Complete
          </button>
          <button mat-button type="button" 
                  title="Add Ticket"
                  *ngIf="!ticket.id"
                  [disabled]="!editor.valid || editor.pristine"
                  (click)="save.emit(editor.value)">
              Save
          </button>
          <button mat-button type="button" 
                  title="Cancel"
                  *ngIf="!ticket.id"
                  (click)="cancel.emit()">
              Cancel
          </button>
        </mat-card-actions>  
      </mat-card>
   `
})
export class TicketCardComponent {
  @Input() users: User[];
  @Input() ticket: Ticket;

  @Output() save = new EventEmitter<Ticket>();
  @Output() cancel = new EventEmitter<void>();
  @Output() reassign = new EventEmitter<string>();
  @Output() complete = new EventEmitter<Ticket>();

  title(ticket): string {
    const status = ticket.completed ? 'Finished' : 'Pending';
    return !ticket.id ? 'Create New Ticket' : `${status} Ticket `;
  }
}
