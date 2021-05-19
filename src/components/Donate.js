import React, {useCallback, useEffect, useState} from "react"
import Checkout from "./Checkout"
import { Check, PinDropSharp } from "@material-ui/icons";
import Grid from '@material-ui/core/Grid';
import { Button, TextField } from '@material-ui/core';
import {API} from 'aws-amplify'
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

export default function Donate(props){
   console.log(props)
   const [locked, setLocked] = useState('pending');
   const [address, setAddress] = useState('pending');
   const [name, setName] = useState();
   const [message, setMessage] = useState();
   const [tokenMap, setTokenMap] = useState([]);
   const [price, setPrice] =useState();
  
   const useStyles = makeStyles((theme) => ({
    layout: {
      width: 'auto',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        width: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        padding: theme.spacing(3),
      }
    }
  }));
  const classes = useStyles();


   const urlParams = new URL(window.location);
   const lockAddress = urlParams.pathname.split("/")[2]
   var paywallConfig = {
       network: "100", 
       locks: {
       },
       icon: 'https://app.unlock-protocol.com/static/images/svg/default.svg', 
       callToAction: {
       default: 'This content is locked. Pay with cryptocurrency to access it!',
       expired: 'This is what is shown when the user had a key which is now expired',
       pending: 'This is the message shown when the user sent a transaction to purchase a key which has not be confirmed yet',
       confirmed: 'This is the message shown when the user has a confirmed key',
       noWallet: 'This is the message shown when the user does not have a crypto wallet which is required...',
       }
   };
   paywallConfig['locks'][lockAddress] = {
    name: "One time contribution!"
  }
   const changeNameField = (e) => {setName(e.target.value)}
   const changeMessageField = (e) => {setMessage(e.target.value)}
   const send = async () => {API.post(
     'streamlabs',
     '/donate',
     {body:{
       name: name,
       message:message,
       walletAddress:props.location.state.walletAddress,
       amount:props.location.state.price,
       currency:'USD',
       
     }})}

  
   console.log("on donate")
   const unlockHandler = useCallback(e => {
                console.log(e)
                setLocked(e.detail)
                setAddress(e.currentTarget.localStorage.userInfo)

            });
    /**
     * Invoked to show the checkout modal provided by Unlock (optional... but convenient!)
     */
    function donate(lock)  {
        console.log(lock)
        paywallConfig['locks'][lock] = {
          name: "One time contribution!"
        }
        window.unlockProtocol && window.unlockProtocol.loadCheckoutModal()
    };


    useEffect(() => {
      console.log(props)
      const existingScript = document.getElementById('unlock-protocol')

      if (!existingScript) {
          const script = document.createElement('script')

          script.innerText = `(function(d, s) {
          var js = d.createElement(s),
              sc = d.getElementsByTagName(s)[0];
          js.src="https://paywall.unlock-protocol.com/static/unlock.latest.min.js";
          sc.parentNode.insertBefore(js, sc); }(document, "script"));
          `
          document.body.appendChild(script)
      }
    
      
      window.unlockProtocolConfig = paywallConfig
      window.addEventListener("unlockProtocol", unlockHandler)


      return () => {window.removeEventListener("unlockProtocol", unlockHandler)
      if(existingScript){
        existingScript.remove();};
    }},[]);
        
      return (
        <div className="App">
          <header className="App-header">
          <Paper className={classes.layout}>
          <Typography variant="h6" gutterBottom>
            Unlock and Send!
          </Typography>
              <Grid>
                  
                  <Paper variant="outlined" style={{marginTop:5}}>
                    
                  <Grid container justify="center">
                      {props.location.state.action === "donation" ?
                      <div>
                        <TextField name="name" label="Name to show" value={name} onChange={changeNameField} fullWidth/>
                        {locked === "locked" ?
                        <Button variant="contained" color="primary" onClick={donate} style={{marginTop:5}}>Unlock</Button>
                        :
                        locked === "unlocked" ?
                        <Button variant="contained" color="primary" onClick={send} style={{marginTop:5}}>Send Notification</Button> 
                        :
                        <div/>
                        }
                      </div>  :
                      props.location.state.action === "superchat" ? 
                          <div>
                            <TextField name="name" label="Your Username" value={name} onChange={changeNameField} fullWidth/>
                            <TextField name="message" label="Message" value={message} onChange={changeMessageField} fullWidth/>
                            {locked === "locked" ?
                            <Button variant="contained" color="primary" onClick={donate} style={{marginTop:5}} >Unlock</Button>
                            :
                            locked === "unlocked" ?
                            <Button variant="contained" color="primary" onClick={send} style={{marginTop:5}}>Send Message</Button> 
                            :
                            <div/>
                            }
                          </div>
                          :
                          <div/>}
                    </Grid>
                    
                  </Paper>
              </Grid>
          </Paper>
          </header>
        </div>
      )
    }
  
