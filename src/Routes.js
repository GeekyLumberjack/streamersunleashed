import React from "react";
import { Route, Switch } from "react-router-dom";
import landingPage from './components/landingPage'
import NotFound from './components/NotFound'
import Donate from './components/Donate'

export default function Routes({ appProps }){
    return(
    <Switch>
        <Route path="/" exact component={landingPage} props={appProps} />
        <Route path="/donate/:id" exact component={Donate} props={appProps} />
        <Route component={NotFound} />
    </Switch> )
}