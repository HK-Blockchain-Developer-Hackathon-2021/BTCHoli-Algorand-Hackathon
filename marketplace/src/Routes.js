import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';

class Router extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/profile/:userid' component={Dashboard} />
                </Switch>
            </BrowserRouter>
        );
    }
}


export default Router;