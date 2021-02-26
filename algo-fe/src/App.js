import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory';
import SignIn from './Signin'
import Menu from './Menu'
import DetailsForm from './DetailsForm';
import BondApproval from './BondApproval';


export const history = createHistory();

const RandomFunc = () => (
    <div>aaaaaa</div>
)

const AppRouter = () => (
  <div>
      <Router history={history}>
          <div>
              <Switch>
                  <Route path="/" component={SignIn} exact={true}/>
                  <Route path="/menu" component={Menu} exact={true}/>
                  <Route path="/create" component={DetailsForm} exact={true}/>
                  <Route path="/approval" component={BondApproval} exact={true}/>
              </Switch>
          </div>
      </Router>
  </div>
)

export default AppRouter