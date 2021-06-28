import React, {useCallback, useEffect, useState, setState} from "react"
import './check.css'
import Grid from '@material-ui/core/Grid';
import { Button, ButtonBase, TextField } from '@material-ui/core';
import {API} from 'aws-amplify'
import Paper from '@material-ui/core/Paper';
import { makeStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Web3Service } from '@unlock-protocol/unlock-js';
import { Paywall, isUnlocked } from '@unlock-protocol/paywall';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import SendDonation from "./SendDonation";
import ChooseDonationButtons from './chooseDonationButtons'
import { networkConfigs, providerConfig } from './networkConfigs'

export default function Donate(props){
   console.log(props)
   //let unlockHandler;
   const [locked, setLocked] = useState('pending');
   const [address, setAddress] = useState('pending');
   const [name, setName] = useState(null);
   const [message, setMessage] = useState(null);
   const [superChat, setSuperChat] = useState(false);
   const [sent, setSent] = useState(null);
   const [tokenMap, setTokenMap] = useState(false);
   const [activeButton, setActiveButton] = useState('1');
  
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

  var web3 = new Web3Service(providerConfig);

   const urlParams = new URL(window.location);
   const walletAddress = urlParams.pathname.split("/")[2]
   
   

   var paywallConfig = {
       network: 100, 
       locks: {
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
   var paywall = new Paywall(paywallConfig, networkConfigs)
   const changeNameField = (e) => {setName(e.target.value)}
   const changeMessageField = (e) => {setMessage(e.target.value)}
   

  
   
   
    /**
     * Invoked to show the checkout modal provided by Unlock (optional... but convenient!)
     */
    function donate()  {
      
        paywallConfig['network'] = Object.entries(tokenMap[Number(activeButton)]).find(net => net[0].slice(0,-1) === "network")[1]
        paywallConfig['locks'][Object.entries(tokenMap[Number(activeButton)]).find(net => net[0].slice(0,-1) === "address")[1]] = {
          name: "One time contribution!"
        }
        //console.log(paywallConfig, networkConfigs)
        
        paywall.loadCheckoutModal(paywallConfig)
        //setLocked(paywall.getState())
    };

    async function getTokenMap(){  
      const getTokens = await API.get(
      'streamlabs',
      '/getTokenMap?walletAddress='+walletAddress,
      )
      const map =getTokens.Response.Item.tokenMap
      
      for(var i=0; i<map.length; i++){
        try{
          var getLockPrice = await web3.getLock(Object.entries(map[i]).find(net => net[0].slice(0,-1) === "address")[1],Object.entries(map[i]).find(net => net[0].slice(0,-1) === "network")[1]);
          map[i]['price'] = getLockPrice.keyPrice;
        }catch{
          map[i]['price'] = "?"
        }
        
      }
      
      setTokenMap(map);
      
      
    }

    function needsAlert(){

      for(var i=0; i<tokenMap.length; i++){
        if(Object.entries(tokenMap[i]).find(net => net[0] === "price")[1] === "?"){
          return true
        }
      }
      return false
    }

    const unlockHandler = useCallback(e => {
      if(e.detail.state === 'unlocked'){
        setLocked(e.detail.state)
        
      }
      setAddress(e.currentTarget.localStorage.userInfo)
      
    });

    useEffect(() => {
      
      if(tokenMap === false){
        getTokenMap();
      }
      window.addEventListener("unlockProtocol.status", unlockHandler)
      
      return () => {window.removeEventListener("unlockProtocol", unlockHandler)
    }},[]);
        
      return (
        <div className="App">
          <header className="App-header">
          <Paper className={classes.layout}>
          <Typography variant="h6" gutterBottom>
            Unlock and Send!
          </Typography>
              <Grid>
                  {locked === 'unlocked' ?  
                    <SendDonation name={name} message={message} address={address} amount={Object.entries(tokenMap[Number(activeButton)]).find(net => net[0] === "price")[1]} />
                  :
                  <Grid container justify="center">
                    
                        <TextField name="name" label="Your Username" value={name} onChange={changeNameField} fullWidth/>
                        
                        <Grid container justify="center" style={{marginTop:20}}>
                          {tokenMap !== false ?
                            needsAlert() ? 
                              <Alert severity="error" style={{marginBottom:10}}>Some prices failed to retrieve, give it a refresh to see the prices!</Alert>
                              :
                              <div/>
                            :
                            <div/>
                          }
                          <ChooseDonationButtons props={{'tokenMap':tokenMap, 'activeButton':activeButton, 'setActiveButton':setActiveButton} }/>
                        </Grid>
                        
                        {tokenMap[Number(activeButton)] ? 
                         Object.values(tokenMap[Number(activeButton)])[0] === 'superchat' ?
                        <div>
                          <TextField name="message" label="Message" value={message} onChange={changeMessageField} fullWidth/>
                          <Button variant="contained" color="primary" onClick={donate} style={{marginTop:20}} disabled={name === null || message === null ? true : false}>Send Message</Button> 
                        </div>
                        :
                        <Button variant="contained" color="primary" onClick={donate} style={{marginTop:20}} disabled={name === null ? true : false}>Send Donation</Button> 
                        
                        :
                        <div/>}
                        
                        
                            
                    </Grid>
                  }

              </Grid>
          </Paper>
          </header>
        </div>
      )
    }
  
