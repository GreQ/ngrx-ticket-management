import * as express from 'express';
import * as bodyParser from 'body-parser';
import { APP_ROUTES } from './app-routes';
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

registerAppRoutes(app);

app.listen(3000, () => console.log('Example app listening on port 3000!'));

function  registerAppRoutes(app) {
  for( let key in APP_ROUTES.GET ) {
    app.get(key, APP_ROUTES.GET[key]);
  }

  for( let key in APP_ROUTES.POST ) {
    console.log(key);
    app.post(key, APP_ROUTES.POST[key]);
  }
}
