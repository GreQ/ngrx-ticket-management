# Exploring State Management

Let's build a ticket managing application, where the user can add, filter, assign, and complete tickets.

![ticket-grid-view](https://user-images.githubusercontent.com/210413/39407154-801b4fb2-4b87-11e8-95d5-53a770404f1f.jpg)

### Starting an App


Run `./start.sh` to launch the API server and the client.

> The bash script `start.sh` simply does this: 
```bash
   (cd server && npm run server) &
   (cd client && ng serve --proxy-config proxy.config.json)
```


* The REST server runs on the port 3000, and
* The Web app runs on the port `http://localhost:4200`.

Open the web ap in the browser, and you'll see the tickets and users lists.

<br/>

- - -

<br/>

#### Challenging Developer

We will use the following raw application as a starting point:


![raw-ux](https://user-images.githubusercontent.com/210413/33805770-a07c7b22-dd83-11e7-965f-bf24d840b257.jpg)

```js
const SAMPLE = { id:"1", title: "Prepare Challenge Lessons"};

@Component({
  selector: 'ticket-app',
  styleUrls: [ './app.component.css' ],
  template: `      
      Filter: <input (input)="noop()" #filter>
      
      <h2>Tickets</h2>
      <ul>
        <li>
          ({{ticket.id}}) {{ticket.title}}
          <button (click)="noop()">Complete</button>
        </li>
      </ul>
      
      <hr> 
      
      <input #newTicket>
      <button (click)="noop()">Add New Ticket</button>
   `
})
export class AppComponent {
  ticket : Ticket = SAMPLE;
  constructor(public service: Backend) { }

  noop() { ;}
}
````


<br/>


##### Challenge Requirements


* The app should have two screens: the list screen and the details screen.
* When working on the full UX, use the Angular router to manage the transitions between them.
* Even though we tend to use NgRx for state management, you can use a different approach if you think it fits better.
* Write a couple of tests. The goal here is not to build a production-quality app, so don't test every single detail. Two or three tests should be good enough.
* Don't forget about error handling and race conditions.
  >  The API server has a random delay.
  >  If you bump it up to say 10 seconds, would the app still work correctly?

<br/>

##### Starting the Challenge

*  Checkout the branch `challenge_start`
*  Run `npm i`
*  Run `./start.sh` to confirm the raw application above ^ runs properly.
*  Modify the code and UX to build the full UX.

Developers should first focus on data + state management before any UX improvements.

Even though the app seems small, one can easily spend the whole week working on it: perfecting styles, testing every single method, or carefully crafting every single line of code.

> Please don't! Do as much as you can in about 2-4 hours and share the results.

The most important part of the interview will come after this one, when we look at the app together, talk about the decisions you have made, etc..

