import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import Routes from "./Routes";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';

function App(){
    return(
    
    <AppBar position="absolute" color="default" className={{position: 'relative',}}>
            <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
                Company name
            </Typography>
            </Toolbar>
            <Routes/>
    </AppBar>)
}
export default withRouter(App);