## Challenges

For training purposes, let's use a series of commits to explore state management options and solutions. The impact on view components is a significant reduction in component complexity to and imperative logic:

<br/>

![lessonsnapshots](https://user-images.githubusercontent.com/210413/33800516-9f9586c2-dd06-11e7-85fd-c4367cbf6cb0.jpg)

<br/>

###### Phase 1 Code (finish)

```js
@Component({
  selector: 'ticket-app',
  styleUrls: ['./app.component.css']
  template: `
    <h2>Tickets</h2>
    <input (input)="service.filter(filter.value)" #filter>
    
    <ul>
      <li *ngFor="let t of (tickets$ | async)">
        Ticket: {{t.id}}, {{t.title}}
        <button (click)="service.closeTicket(t)">Complete</button>
      </li>
    </ul>
  
    <input #newTicket>
    <button (click)="service.addTicket(newTicket.value)">Add New Ticket</button>
   `,
})
export class AppComponent {
  tickets$ : Observable<Ticket[]> = this.service.tickets$;
  
  constructor(public service: TicketFacade) { }
}
```

<br/>






- - -
> Developers are encouraged to review each lesson and the associated review notes.

- - -



### Training Phases

Traditionally, developers can use Observables to extract raw data and manage state with custom logic... much like ^ shown above.

Best-practices often refactor state management logic into one-way, immutable data flows and patterns espoused by Redux. Combining these Redux patterns with the power of Observables is often still insufficient when addressing asynchronous activity. To address these concerns, developers will see their code evolve to use Effects and Facades.

The **Lessons** are divided into 3 Phases:

*  **Raw UI** 
	*  Filter on client-side only
	*  Add Tickets [to server and client]
	*  Delete and Complete Tickets [on server and client]
	*  Out-of-Order Processing
	*  Other considerations:
		*  When possible, use the async pipe in the template(s)
		*  Do not worry about filter debouncing or server thrash
		*  Do not significantly modify Backend services
*  **Full UX**
	*  Use template or reactive forms
	*  Add routing and/or injectable services
	*  Add Angular Material UI components
*  **Full UX + ngrx + Mono-repository**

### Lessons

###### Phase 1: Raw UI + State Management

We will start with a crude UI to explore how raw dataservices is better managed with Redux-like features: actions, reducer, selectors. Then we will extend this approach with Effects to support async background acctions. And finally, we will refactor our non-UI code to use a Facade pattern... that hides all state management complexities within a simple API.

*  Step 0: Initial setup
*  Step 1: Use subcribe() to extract raw data
*  Step 2: Use action objects
*  Step 3: Use reducer function to modify state
*  Step 4: Use async-like actions
*  Step 5: Using promise queue
*  Step 6: Use Redux store/action patterns
*  Step 7: Simulate effects for async actions
*  Step 8: Use TicketFacade service

###### Phase 2: Rich UI + State Management + Routing + Forms




