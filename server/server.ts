import * as express from "express";
import * as bodyParser from "body-parser";
import { registerAppRoutes } from "./server-routes";

const app = express();

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
