import React, {useCallback, useEffect, useState, setState} from "react"
import './check.css'
import Grid from '@material-ui/core/Grid';
import { Button, ButtonBase, TextField } from '@material-ui/core';
import { withStyles } from "@material-ui/styles";
import {API} from 'aws-amplify'
import Paper from '@material-ui/core/Paper';
import { makeStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Web3Service, WalletService } from '@unlock-protocol/unlock-js';
import { useWeb3Context } from 'web3-react'
import { Paywall } from '@unlock-protocol/paywall';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import SendDonation from "./SendDonation";
import ChooseDonationButtons from './chooseDonationButtons'
import { networkConfigs, providerConfig, convertCoin } from './networkConfigs'
import { BlackButton } from "./BlackButton";
import CoinGecko from "coingecko-api";



export default function Donate(props){
  var paywallConfig = {
    network: 100, 
    locks: {
    },
    icon: 'https://app.unlock-protocol.com/static/images/svg/default.svg', 
    callToAction: {
    default: 'Follow the prompts to donate!',
    expired: 'Your donation has expired! Donate here again!',
    pending: 'Your donation is pending.',
    confirmed: 'Thank you for donating!',
    noWallet: 'Please download a crypto wallet to donate!',
    },
    referrer: "0x6115BB18b17CFC53A8f73202D98221A89501b154"
    };
   const [paywall, setPaywall] = useState();
   const [intervalId, setIntervalId] = useState();
   const [unlocked, setUnlocked] = useState(false);
   const [address, setAddress] = useState(false);
   const [name, setName] = useState("");
   const [message, setMessage] = useState("");
   const [needsAlert, setNeedsAlert] = useState(false);
   const [web3, setWeb3] = useState(new Web3Service(providerConfig));
   const [authenticated, setAuthenticated] = useState(false);
   const [tokenMap, setTokenMap] = useState([]);
   const [activeButton, setActiveButton] = useState('0');
   const [lockId, setLockId] = useState();
   const [networkId, setNetworkId] = useState();
   const urlParams = new URL(window.location);
   const walletAddress = urlParams.pathname.split("/")[2]
   
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
    console.log(e.detail)
    if(e.detail.address){
      setAddress(e.detail.address);
      
    }
  });
  
  useEffect(() => {
    if(unlocked){
      clearInterval(intervalId);
    }
    if(address && !unlocked){
      //console.log(lockId,address,networkId)
      setIntervalId(
        setInterval( async () => {
          //console.log(unlocked, lockId, networkId)
          const contract = await web3.lockContract(lockId, networkId);
          setUnlocked(await contract.getHasValidKey(address))
          
        }, 2000)
      )
    }
    
  }, [address, unlocked])

  useEffect(() => {
    setPaywall(new Paywall(paywallConfig, networkConfigs))
    window.addEventListener("unlockProtocol.status", unlockHandler)
    window.addEventListener("unlockProtocol.authenticated", unlockHandler)
    setAddress(false);
    clearInterval(intervalId);
    return () => {window.removeEventListener("unlockProtocol.status", unlockHandler)
    window.removeEventListener("unlockProtocol.authenticated", unlockHandler)
  }}, [activeButton]);
   

   
   
   const changeNameField = (e) => {setName(e.target.value)}
   const changeMessageField = (e) => {setMessage(e.target.value)}
   

   


    



    useEffect(() => {
       const coinClient = new CoinGecko()
       async function getTokenMap() {  
          try{
            
           
            const getTokens = await API.get(
            'streamlabs',
            '/getTokenMap?walletAddress='+walletAddress,
            )
            const map =getTokens.Response.Item.tokenMap
            
            for(var i=0; i<map.length; i++){
              
              try{
                var net = Object.entries(map[i]).find(net => net[0].slice(0,-1) === "network")[1]
                var getLockPrice = await web3.getLock(Object.entries(map[i]).find(net => net[0].slice(0,-1) === "address")[1],net);
                map[i]['cryptoPrice'] = getLockPrice['keyPrice'];
                for(var z=0; z<convertCoin.length; z++){
                  if(Object.keys(convertCoin[z])[0] === String(net)){ 
                    var convert = Object.values(convertCoin[z])[0]
                     
                  }
                }
                console.log(convert)
                var convertPrice = await coinClient.simple.price({'ids':[convert],'vs_currencies':['usd']})
                console.log(convertPrice)
                map[i]['fiatPrice'] = Math.round(convertPrice['data'][convert]['usd'] * map[i]['cryptoPrice'])
                console.log(map[i]['fiatPrice'])
                
              }catch{
                map[i]['cryptoPrice'] = "?"
                map[i]['fiatPrice'] = "?"
                setNeedsAlert(true);
              }
              
            }
            
            setTokenMap(map);
            
        }catch (e) {
          console.log(e.message); 
        }
      }
      
      getTokenMap()
        
      
    },[]);
    function donate()  {
      var alockId = Object.entries(tokenMap[Number(activeButton)]).find(net => net[0].slice(0,-1) === "address")[1]
      var anetworkId = Object.entries(tokenMap[Number(activeButton)]).find(net => net[0].slice(0,-1) === "network")[1]
      setNetworkId(anetworkId);
      setLockId(alockId);
      paywallConfig['network'] = anetworkId
      paywallConfig['locks'][alockId] = {
        name: "Donate!"
      }
      
      
      paywall.loadCheckoutModal(paywallConfig);
      
     // setInterval(
      //  async () => {console.log(address.account,await web3.getTokenBalance(lockId, address.account, networkId))}, 1000);
  };
  
  

      return (
        <div className="App" style={{marginTop:100}}>
          <header className="App-header">
          <Paper className={classes.layout}>
          <Typography variant="h6" gutterBottom>
            Unlock and Send!
          </Typography>
              <Grid>
                  {unlocked ?  
                    <SendDonation name={name} message={message} address={walletAddress} amount={Object.entries(tokenMap[Number(activeButton)]).find(net => net[0] === "fiatPrice")[1]} />
                  :
                  <Grid container justifyContent="center">
                    
                        <TextField name="name" label="Your Username" value={name} onChange={changeNameField} fullWidth/>
                        
                        <Grid container justifyContent="center" style={{marginTop:20}}>
                          {
                            needsAlert ? 
                              <Alert severity="error" style={{marginBottom:10}}>Some prices failed to retrieve, refresh to see the prices!</Alert>
                              :
                              <div/>
                          }
                         <ChooseDonationButtons props={{'tokenMap':tokenMap, 'activeButton':activeButton, 'setActiveButton':setActiveButton} }/>
                        </Grid>
                        
                        {tokenMap.length > 0 ? 
                         Object.entries(tokenMap[Number(activeButton)]).find(net => net[1] === "superchat") ?
                        <div>
                          <TextField name="message" label="Message" value={message} onChange={changeMessageField} fullWidth/>
                          <BlackButton variant="contained" onClick={() => donate()} style={{marginTop:20}} disabled={name.length < 2 || name.length > 25 || message.length > 255 || message.length < 1 ? true : false}>Send Message</BlackButton> 
                        </div>
                        :
                        <div>
                        <BlackButton variant="contained" onClick={() => donate()} style={{marginTop:20}} disabled={name.length < 2 || name.length > 25 ? true : false}>Send Donation</BlackButton> 
                        </div>
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
  
   // https://streamersunleashed.com/donate/0x6115BB18b17CFC53A8f73202D98221A89501b154
