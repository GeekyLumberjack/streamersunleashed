import React, {useCallback, useEffect, useState} from "react"
import Checkout from "./Checkout"
import { Check } from "@material-ui/icons";
import Grid from '@material-ui/core/Grid';
import { Button, TextField } from '@material-ui/core';
import {API} from 'aws-amplify'
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import {Web3Service} from '@unlock-protocol/unlock-js';

export default function Donate(){
   const [locked, setLocked] = useState('pending');
   const [address, setAddress] = useState('pending');
   const [name, setName] = useState();
   const [message, setMessage] = useState();
   const [tokenMap, setTokenMap] = useState([]);
   var web3 = new Web3Service({100:{
     provider:"https://rpc.xdaichain.com/"
   }});
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
   const walletAddress = urlParams.pathname.split("/")[2]
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
   paywallConfig['locks']['0x72710B5D938c79061DBf537013D715A9fD286d49'] = {
    name: "One time contribution!"
  }
   const changeNameField = (e) => {setName(e.target.value)}
   const changeMessageField = (e) => {setMessage(e.target.value)}
   const send = async () => {API.post(
     'streamlabs',
     '/donate',
     {body:{
       name: name,
       walletAddress:walletAddress,
       amount:1,
       currency:'USD',
       
     }})}

    async function getTokenMap(){  
    const getTokens = await API.get(
    'streamlabs',
    '/getTokenMap?walletAddress='+walletAddress,
    )
    const map =getTokens.Response.Item.tokenMap
    for(var i=0; i<map.length; i++){
      var getLockPrice = await web3.getLock(Object.values(map[i])[1],100);
      map[i]['price'] = getLockPrice.keyPrice;
    }
    
    setTokenMap(map);
  }

   console.log("on donate")
   const unlockHandler = useCallback(e => {
                console.log(e)
                setLocked(e.detail)
                setAddress(e.currentTarget.localStorage.userInfo)

            });
    /**
     * Invoked to show the checkout modal provided by Unlock (optional... but convenient!)
     */
    const donate = useCallback(e => {
        console.log(e)
        paywallConfig['locks'][e.lock] = {
          name: "One time contribution!"
        }
        window.unlockProtocol && window.unlockProtocol.loadCheckoutModal()

    });

    function renderTokenList(tokenList){
      return(
      tokenList.map((token) => (
        <Grid container justify="center">
          {Object.values(token)[0] === "donation" ?
          <div>
            <TextField name="name" label="Name to show" value={name} onChange={changeNameField} fullWidth/>
            <Button color="primary" lock={Object.values(token)[1]} onClick={donate} style={{marginTop:5}}>Donate {Object.values(token)[2]}</Button>
          </div>  :
          Object.values(token)[0] === "superchat" ? 
              <div>
                <TextField name="name" label="Your Username" value={name} onChange={changeNameField} fullWidth/>
                <TextField name="message" label="Message" value={message} onChange={changeMessageField} fullWidth/>
                <Button variant="contained" color="primary" lock={Object.values(token)[1]} onClick={donate} style={{marginTop:5}}>Donate {Object.values(token)[2]}</Button>
              </div>
              :
              <div/>}
        </Grid>
      ))
      )
    }


    useEffect(() => {
      const tokenList = getTokenMap()
      
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
              <Grid>
                  
                  <Paper variant="outlined" style={{marginTop:5}}>
                    
                      {renderTokenList(tokenMap)}
                    
                  </Paper>
              </Grid>
          </Paper>
          </header>
        </div>
      )
    }
  
