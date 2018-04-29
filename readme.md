# Exploring State Management

Let's build a ticket managing application, where the user can add, filter, assign, and complete tickets. The goal is to demonstrate usages of NgRx, Effects, Facades, and more.

![ticket-grid-view](https://user-images.githubusercontent.com/210413/39407154-801b4fb2-4b87-11e8-95d5-53a770404f1f.jpg)


- - -

<br/>

#### The Developer-Challenge

The starting point is a raw application as a starting point:


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
          <button (click)="">Complete</button>
        </li>
      </ul>
      
      <hr> 
      
      <input #newTicket>
      <button (click)="">Add New Ticket</button>
   `
})
export class AppComponent {
  ticket : Ticket = SAMPLE;
  constructor(public service: Backend) { }
}
````

<br/>


---

<br/>

##### Challenge Requirements


* The app should have two screens: the list screen and the details screen.
* When working on the full UX, use the Angular router to manage the transitions between them.
* Use NgRx for state management.
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

----

### Finished Version

Run `./start.sh` to launch the API server and the client.

> The bash script `start.sh` simply does this: 
```bash
   (npm run server) &
   (ng serve --proxy-config proxy.config.json)
```


* The REST server runs on the port 3000, and
* The Web app runs on the port `http://localhost:4200`. 

Open the web ap in the browser, and you'll see the tickets and users lists.

<br/>
