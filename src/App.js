import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import Routes from "./Routes";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import logo from './images/Color logo with background.svg'
import { ThemeProvider } from "@material-ui/styles";
import {theme} from './theme.js'

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
    <ThemeProvider theme={theme}>
      <AppBar position="absolute" color="primary" >
              <Toolbar>
              <img src={logo} alt="Streamers Unleashed" style={{maxWidth:200}}/>
              
              <Typography variant="h6" color="inherit" noWrap style={{marginLeft:'auto'}}>
              <a href={window.location.href.slice(0,37) === "https://streamersunleashed.com/donate" ? "https://geekylumberjack.medium.com/donating-with-streamers-unleashed-6c93e7fe2a00": "https://geekylumberjack.medium.com/configure-streamers-unleashed-4b2585dcc624"} style={{color:'black'}}>
                Guide
              </a>
              </Typography>
              <Typography variant="h6" color="inherit" noWrap style={{marginLeft:20}}>
                  <a href="https://discord.gg/HS2GrsPFUm" style={{color:'black'}}>
                    Chat
                  </a>
              </Typography>
              </Toolbar>
      </AppBar>
              <Routes/>
              <Copyright />
      
    </ThemeProvider>)
}
export default withRouter(App);