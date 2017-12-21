import * as express from 'express';
import * as bodyParser from 'body-parser';
import { loadAppRoutes } from './app-routes';

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

registerAppRoutes(app);

app.listen(3000, () => console.log('Example app listening on port 3000!'));

function  registerAppRoutes(app) {
  const routes = loadAppRoutes();
  for( let key in routes.GET ) {
    console.log(key);
    app.get(key, routes.GET[key]);
  }

  for( let key in routes.POST ) {
    console.log(key);
    app.post(key, routes.POST[key]);
  }

}
