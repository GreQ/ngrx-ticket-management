import * as express from 'express';
import * as bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const MULTI_SPACES = /\s\s+/g;
function  trim(target:string) {
  return target
      .replace(MULTI_SPACES,' ')
      .replace(/^\s+/g,'')
}

import {users} from './contacts';

let lastId = 4;
let tickets = [
  {
    id: '0',
    title: 'Install a monitor arm',
    description: trim(`
      Nor again is there anyone who loves or pursues or desires to obtain pain of itself, 
      because it is pain, but because occasionally circumstances occur in which toil and 
      pain can procure him some great pleasure.
    `),
    assigneeId: '1',
    completed: false
  },
  {
    id: '1',
    title: 'Move the desk to the new location',
    description: trim(`
      These cases are perfectly simple and easy to distinguish. In a free hour, 
      when our power of choice is untrammelled and when nothing prevents our being able to 
      do what we like best, every pleasure is to be welcomed and every pain avoided.
    `),
    assigneeId: '3',
    completed: true
  },
  {
    id: '2',
    title: 'Recharge Tesla car battery',
    description: trim(`
      Et harum quidem rerum facilis est et expedita distinctio. 
      Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus 
      id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor 
      repellendus. 
    `),
    assigneeId: '2',
    completed: false
  }
];


const ENABLE_DELAYS = true;

app.get('/api/tickets', (req, res) => {
  const stop = start('/api/tickets');
  setTimeout(() => {
    res.send(tickets);
    stop();
  }, randomDelay());
});

app.get('/api/users', (req, res) => {
  const stop = start('/api/users');
  setTimeout(() => {
    res.send(users);
    stop();
  }, randomDelay());
});

app.get('/api/ticket/:id', (req, res) => {
  setTimeout(() => {
    const matching = tickets.filter(t => t.id === req.params.id)[0];
    if (matching) {
      res.send(matching);
    } else {
      res.status(404).send({error: `Cannot find ticket ${req.params.id}`});
    }
  }, randomDelay());
});

app.get('/api/users/:id', (req, res) => {
  setTimeout(() => {
    const matching = users.filter(t => t.id === req.params.id)[0];
    if (matching) {
      res.send(matching);
    } else {
      res.status(404).send({error: `Cannot find user ${req.params.id}`});
    }
  }, randomDelay());
});

app.post('/api/tickets', (req, res) => {
  const stop = start('/api/tickets');
  setTimeout(() => {
    const t = req.body;
    if (!t.title) {
      res.status(500).send({error: `title is a required field`});
    } else {
      const newTicket = {
        id: `${++lastId}`,
        title: t.title,
        description : t.description || '',
        assigneeId: null,
        image: '/assets/images/5.jpg',
        completed: false
      };

      tickets.push(newTicket);
      res.send(newTicket);
      stop();
    }
  }, randomDelay());
});

app.post('/api/assign', (req, res) => {
  setTimeout(() => {
    const ticketId = req.body.ticketId;
    const assigneeId = req.body.assigneeId;

    const matchingTicket = tickets.filter(t => t.id === ticketId)[0];
    const matchingUser = users.filter(u => u.id === assigneeId)[0];

    if (!matchingTicket) {
      res.status(404).send({error: `Cannot find ticket ${ticketId}`});
    } else if (!matchingUser) {
      res.status(404).send({error: `Cannot find user ${assigneeId}`});
    } else {
      matchingTicket.assigneeId = assigneeId;
      res.send(matchingTicket);
    }
  }, randomDelay());
});

app.post('/api/complete', (req, res) => {
  setTimeout(() => {
    const ticketId = req.body.ticketId;
    const completed = req.body.completed;

    const matchingTicket = tickets.filter(t => t.id === ticketId)[0];

    if (!matchingTicket) {
      res.status(404).send({error: `Cannot find ticket ${ticketId}`});
    } else {
      matchingTicket.completed = completed;
      res.send(matchingTicket);
    }
  }, randomDelay());
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));


function randomDelay() {
  return ENABLE_DELAYS ? Math.random() * 4000 : 0;
}

function  start(api:string) {
  const start = Date.now();
  return () => {
    const now = Date.now();
    console.log(`${api} - ${(now-start)}ms`);
  }
}
