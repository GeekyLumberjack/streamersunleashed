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
        <Link color="inherit" to="/">
          streamersunleashed.com
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }


function App(){
    return(
    
    <AppBar position="absolute" color="default" >
            <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
                Streamers Unleashed 
            </Typography>
            
            <Typography variant="h6" color="inherit" noWrap style={{marginLeft:'auto'}}>
            <a href={window.location.href.slice(0,37) === "https://streamersunleashed.com/donate" ? "https://geekylumberjack.medium.com/donating-with-streamers-unleashed-6c93e7fe2a00": "https://geekylumberjack.medium.com/configure-streamers-unleashed-4b2585dcc624"} style={{color:'black'}}>
              Guide
            </a>
            </Typography>
            <Typography variant="h6" color="inherit" noWrap style={{marginLeft:20}}>
                <a href="https://discord.gg/SpK4Fxs2" style={{color:'black'}}>
                  Chat
                </a>
            </Typography>
            </Toolbar>
            <Routes/>
            <Copyright />
    </AppBar>)
}
export default withRouter(App);