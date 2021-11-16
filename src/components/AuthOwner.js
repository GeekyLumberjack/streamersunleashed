import React, {useCallback, useEffect, useState} from "react"
import Checkout from "./Checkout"
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { Button, TextField } from '@material-ui/core';

export default function AuthOwner(){
   const [locked, setLocked] = useState('pending');
   const [address, setAddress] = useState('pending');  
   console.log("AuthOwner");
   var paywallConfig = {
    network: "100", 
    locks: {
    '0xac1fceC2e4064CCd83ac8C9B0c9B8d944AB0D246': {
        name: "One time contribution!"
    }

    },
    icon: 'https://app.unlock-protocol.com/static/images/svg/default.svg', 
    callToAction: {
    default: 'This content is locked. Pay with cryptocurrency to access it!',
    expired: 'This is what is shown when the user had a key which is now expired',
    pending: 'This is the message shown when the user sent a transaction to purchase a key which has not be confirmed yet',
    confirmed: 'This is the message shown when the user has a confirmed key',
    noWallet: 'This is the message shown when the user does not have a crypto wallet which is required...',
    },
    referrer: "0x6115BB18b17CFC53A8f73202D98221A89501b154"
};

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

   const unlockHandler = useCallback(e => {
                console.log(e)
                setLocked(e.detail.state)
                setAddress(e.currentTarget.localStorage.userInfo)

            });
    /**
     * Invoked to show the checkout modal provided by Unlock (optional... but convenient!)
     */
    const checkout = useCallback(e => {
        window.unlockProtocol && window.unlockProtocol.loadCheckoutModal()

    });

    useEffect(() => {
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
      window.addEventListener('unlockProtocol.status',unlockHandler) 
      return () => {window.removeEventListener("unlockProtocol", unlockHandler)
      if(existingScript){
        existingScript.remove();
    }}
      },[]);


        console.log(address)
      
        
        

        
      return (
        <div className="App">
        {locked === "locked"  && (
          <Paper className={classes.layout} color='lightBlack'>
              <Grid>     
                <Button variant="contained" color="secondary" onClick={checkout} style={{ cursor: "pointer" }} size='large'>
                  Unlock Streamers Unleashed
                </Button>  
              </Grid>
          </Paper>
            
            )}
            {locked === "unlocked" && address !== 'pending' && (
              <div>
                  <Checkout props={ address }/>
              </div>
            )}
          
        </div>
      )
    }
  
