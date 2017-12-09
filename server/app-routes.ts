import {users} from './contacts';

var MULTI_SPACES = /\s\s+/g;
var lastId = 4;
var tickets = [
  {
    id: '0',
    title: 'Install a monitor arm',
    description: trim("\n      Nor again is there anyone who loves or pursues or desires to obtain pain of itself, \n      because it is pain, but because occasionally circumstances occur in which toil and \n      pain can procure him some great pleasure.\n    "),
    assigneeId: '1',
    imageURL : '',
    completed: false
  },
  {
    id: '1',
    title: 'Move the desk to the new location',
    description: trim("\n      These cases are perfectly simple and easy to distinguish. In a free hour, \n      when our power of choice is untrammelled and when nothing prevents our being able to \n      do what we like best, every pleasure is to be welcomed and every pain avoided.\n    "),
    assigneeId: '3',
    imageURL : '',
    completed: true
  },
  {
    id: '2',
    title: 'Recharge Tesla car battery',
    description: trim("\n      Et harum quidem rerum facilis est et expedita distinctio. \n      Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus \n      id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor \n      repellendus. \n    "),
    assigneeId: '2',
    imageURL : '',
    completed: false
  }
];

/**
 * Enable random delays in server responses...
 */
var ENABLE_DELAYS = false;



export const APP_ROUTES = {
  'GET' : {
    '/api/tickets'    : (req, res) => {
                  var stop = start('/api/tickets');
                  setTimeout(function() {
                      res.send(tickets);
                      stop();
                  }, randomDelay());
                },
    '/api/users'      : (req, res) => {
                  var stop = start('/api/users');
                  setTimeout(function() {
                      res.send(users);
                      stop();
                  }, randomDelay());
                },
    '/api/ticket/:id' : (req, res) => {
                setTimeout(function() {
                    var matching = tickets.filter(function(t) {
                      return t.id === req.params.id;
                    })[0];
                    if (matching) {
                      res.send(matching);
                    }
                    else {
                      res.status(404).send({error: "Cannot find ticket " + req.params.id});
                    }
                }, randomDelay());
              },
    '/api/users/:id'  : (req, res) => {
              setTimeout(function() {
                  var matching = users.filter(function(t) {
                    return t.id === req.params.id;
                  })[0];
                  if (matching) {
                    res.send(matching);
                  }
                  else {
                    res.status(404).send({error: "Cannot find user " + req.params.id});
                  }
              }, randomDelay());
            }
          },
  'POST' : {
    '/api/tickets'    : (req, res) => {
            var stop = start('/api/tickets');
            setTimeout(function() {
              const t = req.body;
              if (!t.title) {
                res.status(500).send({error: `title is a required field`});
              } else {
                const newTicket = {
                  id          : `${++lastId}`,
                  title       : t.title,
                  description : t.description || '',
                  assigneeId  : t.assigneeId || '',
                  imageURL    : '',
                  completed   : false
                };

                tickets.push(newTicket);
                res.send(newTicket);

                stop();
                }
              }, randomDelay());
            },
    '/api/assign'     : (req, res) => {
            setTimeout(function() {
              const {ticketId, assigneeId} = req.body;

              const matchingTicket = tickets.filter(t => t.id === ticketId)[0];
              const assignedTo = users.filter(u => u.id === assigneeId)[0];

              if (!matchingTicket) {
                res.status(404).send({error: `Cannot find ticket ${ticketId}`});
              } else if (!assignedTo) {
                res.status(404).send({error: `Cannot find user ${assigneeId}`});
              } else {
                matchingTicket.assigneeId = assigneeId;
                matchingTicket.imageURL = assignedTo.imageURL;

                res.send(matchingTicket);
              }
            }, randomDelay());
          },
    '/api/complete'   : (req, res) => {
          setTimeout(function() {
            const {ticketId, completed} = req.body;
            const matchingTicket = tickets.filter(t => t.id === ticketId)[0];

            if (!matchingTicket) {
              res.status(404).send({error: `Cannot find ticket ${ticketId}`});
            } else {
              const assignedTo = users.filter(u => u.id === matchingTicket.id)[0];
              matchingTicket.assigneeId = assignedTo.id;
              matchingTicket.imageURL = assignedTo.imageURL;
              matchingTicket.completed = completed;

              res.send(matchingTicket);
            }
          }, randomDelay());
        }
  }
};


function trim(target) {
  return target
      .replace(MULTI_SPACES, ' ')
      .replace(/^\s+/g, '');
}

function randomDelay() {
  return ENABLE_DELAYS ? Math.random() * 4000 : 0;
}


function start(api) {
  var start = Date.now();
  return function() {
    var now = Date.now();
    console.log(api + " - " + (now - start) + "ms");
  };
}
