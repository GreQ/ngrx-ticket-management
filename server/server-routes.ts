import { users } from "./data/contacts";
import { tickets } from "./data/tickets";

var lastId = 4;

/**
 * Return collection of endpoints (routes) + handlers for
 * GET and POST HTTP requests
 */
export function loadAppRoutes(enableDelays = true) {
  const randomDelay = () => (enableDelays ? Math.random() * 4000 : 0);
  const delayResponse = fn => setTimeout(fn, randomDelay());

  return {
    GET: {
      "/api/tickets": (req, res) => {
        var stop = start("/api/tickets");
        delayResponse(function() {
          res.send(tickets);
          stop();
        });
      },
      "/api/users": (req, res) => {
        var stop = start("/api/users");
        delayResponse(function() {
          res.send(users);
          stop();
        });
      },
      "/api/ticket/:id": (req, res) => {
        delayResponse(function() {
          var matching = tickets.filter(function(t) {
            return t.id === req.params.id;
          })[0];
          if (matching) {
            res.send(matching);
          } else {
            res
              .status(404)
              .send({ error: "Cannot find ticket " + req.params.id });
          }
        });
      },
      "/api/users/:id": (req, res) => {
        delayResponse(function() {
          var matching = users.filter(function(t) {
            return t.id === req.params.id;
          })[0];
          if (matching) {
            res.send(matching);
          } else {
            res
              .status(404)
              .send({ error: "Cannot find user " + req.params.id });
          }
        });
      }
    },
    POST: {
      "/api/tickets": (req, res) => {
        var stop = start("/api/tickets");
        delayResponse(function() {
          const t = req.body;
          const assignedTo = users.filter(u => u.id === t.assigneeId)[0];
          if (!t.title) {
            res.status(500).send({ error: `title is a required field` });
          } else {
            const newTicket = {
              id: `${++lastId}`,
              title: t.title,
              description: t.description || "",
              assigneeId: t.assigneeId || "",
              imageURL: assignedTo.imageURL,
              completed: false
            };

            tickets.push(newTicket);
            res.send(newTicket);

            stop();
          }
        });
      },
      "/api/assign": (req, res) => {
        delayResponse(function() {
          const { ticketId, assigneeId } = req.body;

          const matchingTicket = tickets.filter(t => t.id === ticketId)[0];
          const assignedTo = users.filter(u => u.id === assigneeId)[0];

          if (!matchingTicket) {
            res.status(404).send({ error: `Cannot find ticket ${ticketId}` });
          } else if (!assignedTo) {
            res.status(404).send({ error: `Cannot find user ${assigneeId}` });
          } else {
            matchingTicket.assigneeId = assigneeId;
            matchingTicket.imageURL = assignedTo.imageURL;

            res.send(matchingTicket);
          }
        });
      },
      "/api/complete": (req, res) => {
        delayResponse(function() {
          const { ticketId, completed } = req.body;
          const matchingTicket = tickets.filter(t => t.id === ticketId)[0];

          if (!matchingTicket) {
            res.status(404).send({ error: `Cannot find ticket ${ticketId}` });
          } else {
            const assignedTo = users.filter(
              u => u.id === matchingTicket.assigneeId
            )[0];
            matchingTicket.assigneeId = assignedTo.id;
            matchingTicket.imageURL = assignedTo.imageURL;
            matchingTicket.completed = completed;

            res.send(matchingTicket);
          }
        });
      }
    }
  };
}

/**
 * Register the GET & POST handlers with
 * the Express server
 */
export function registerAppRoutes(app) {
  const routes = loadAppRoutes();

  for (let key in routes.GET) {
    console.log(key);
    app.get(key, routes.GET[key]);
  }

  for (let key in routes.POST) {
    console.log(key);
    app.post(key, routes.POST[key]);
  }
}

/**
 *
 */
function start(api) {
  var start = Date.now();
  return function() {
    var now = Date.now();
    console.log(api + " - " + (now - start) + "ms");
  };
}
