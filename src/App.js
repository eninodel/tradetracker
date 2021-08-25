import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./HomePage";
import CreateTrade from "./CreateTrade";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <HomePage />
            <AmplifySignOut />
          </Route>
          <Route path="/createtrade">
            <CreateTrade />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default withAuthenticator(App);
