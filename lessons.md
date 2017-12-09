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
*  **Full UX + ngrx**

<br/>

- - -


### Lessons

The lesson solutions are provided in a series of commits; outlined below:

###### Phase 1: Raw UI + State Management

We will start with a crude UI to explore how raw dataservices is better managed with Redux-like 
features: actions, reducer, selectors. Then we will extend this approach with Effects to support 
async background acctions. And finally, we will refactor our non-UI code to use a Facade pattern... 
that hides all state management complexities within a simple API.

*  [Step 0: Initial setup](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/21b22ef3d37a57d876d153581ba4c6f8883c8d1f)
*  [Step 1: Use subcribe() to extract raw data](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/eccd9d610ad8cc74d0dad410f91465780e85b685
)
*  [Step 2: Use action objects](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/80c0e26ef06544f2d3469379ba723d1963803c23
)
*  [Step 3: Use reducer function to modify state](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/b622093e11b64a4268fd8a081d22ea1999928245
)
*  [Step 4: Use async-like actions](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/f4176f82e0928149f9e7143678226c4ef65de159
)
*  [Step 5: Using promise queue](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/3a7180f5484a7304b2f98c2605eaa412321158e9
)
*  [Step 6: Use Redux store/action patterns](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/3097d64f48ff9d8110fca67b9692661b04b695d9
)
*  [Step 7: Simulate effects for async actions](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/dfc4428207e9faaf157d69ca0b8f04a47b232fc1
)
*  [Step 8: Use TicketsFacade service](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/70232b547d57f2bc9fb6d68b22d7fb065a4c0c9c
)

###### Phase 2: Use Angular Material

Using `@angular/material` UI components + `@angular/router` dramatically improves the UX with
*real-world* solutions. It also introduces complexities associated with routing and state management.

*  [Step 9:  Add routable, rich UX](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/51eb62fe99ff6304e02b92a4a0bd32e4d34630a5
)
*  [Step 10: Enable TicketEditor and user Avatars](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/41f0dea2d3532b6a0728ec90fb2c7339b7bc469b
)

###### Phase 3: Use Ngrx

Using @ngrx libraries will dramatically simplify the facade custom code, clarify all possible actions.
The use of `@Effect()` decorators declaratively identifies the workflow.

*  [Step 11: Use @ngrx/store + effects](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/386a4dbee3b4a0c99a80c3f86097c76646dd801c)
*  [Step 12: Add TicketCreator UX](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/2644677182f23d36e324f15078386a5d0aed1c99)
*  [Step 13: Support Delayed REST Responses](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/eb4f71cf391c8de155f143af5698025ad6791b36)

###### Phase 4: Use Animations

*  [Step 14: Add Animations](https://github.com/ThomasBurleson/nrwl-ticket-management/commit/0107cfe91ac516443c8cd0840918734442df3318)







