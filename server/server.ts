import * as express from "express";
import * as bodyParser from "body-parser";
import { registerAppRoutes } from "./server-routes";
import { gracefulShutdown } from "./graceful-shutdown";

const app = gracefulShutdown(express());
/*
import { expressCspHeader, SELF } = express-csp-header;
app.use(expressCspHeader({
  directives: {
      'script-src': [SELF]
  },
  reportOnly: true
})) */
import * as csp from "helmet-csp";

app.use(csp({
  directives: {
    defaultSrc: ["'self'", 'localhost:4200', 'mediactiva.com'],
    scriptSrc: ["'self'", 'localhost:4200',"'unsafe-inline'"],
    styleSrc: ["'self'",'fonts.googleapis.com', 'localhost:4200'],
    fontSrc: ["'self'", 'localhost:4200', 'fonts.gstatic.com'],
    imgSrc: ["'self'",'localhost:4200', 'mediactiva.com', 'data:'],
    sandbox: ['allow-forms', 'allow-scripts'],
    reportUri: '/report-violation',
    objectSrc: ["'none'"],
    upgradeInsecureRequests: true,
    workerSrc: false  // This is not set.
  }
}))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

registerAppRoutes(app);

app.listen(3000, () => console.log("Example app listening on port 3000!"));

