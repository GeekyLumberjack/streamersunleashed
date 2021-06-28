import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import Routes from "./Routes";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          streamersunleashed.com
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }


function App(){
    return(
    
    <AppBar position="absolute" color="default" className={{position: 'relative',}}>
            <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
                Streamers Unleashed
            </Typography>
            <Typography variant="h6" color="inherit" noWrap style={{marginLeft:'auto'}}>
                <a href="https://discord.gg/SpK4Fxs2" style={{color:'black'}}>
                  Support
                </a>
            </Typography>
            </Toolbar>
            <Routes/>
            <Copyright />
    </AppBar>)
}
export default withRouter(App);