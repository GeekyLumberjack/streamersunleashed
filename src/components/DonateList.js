import React, {useCallback, useEffect, useState} from "react"
import { Link } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import { Button, TextField } from '@material-ui/core';
import {API} from 'aws-amplify'
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import {Web3Service} from '@unlock-protocol/unlock-js';
import Typography from '@material-ui/core/Typography';

export default function DonateList(){
   const [locked, setLocked] = useState('pending');
   const [address, setAddress] = useState('pending');
   const [name, setName] = useState();
   const [message, setMessage] = useState();
   const [tokenMap, setTokenMap] = useState([]);
   const [price, setPrice] =useState();
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

    function renderTokenList(tokenList){
      return(
      tokenList.map((token) =>(
        <Grid container justify="center">
          {Object.values(token)[0] === "donation" ?
          <Link to={{pathname:"/lock/"+Object.values(token)[1], state: {price: Object.values(token)[2], action: Object.values(token)[0], walletAddress:walletAddress}}}>
            <Button variant="contained" color="primary"style={{marginTop:5}}>Donate {Object.values(token)[2]}</Button>
          </Link>  :
          Object.values(token)[0] === "superchat" ? 
              <Link to={{pathname:"/lock/"+Object.values(token)[1], state: {price: Object.values(token)[2], action: Object.values(token)[0], walletAddress:walletAddress}}}>
                <Button variant="contained" color="primary" style={{marginTop:5}} >Superchat {Object.values(token)[2]}</Button>
              </Link>
              :
              <div/>}
        </Grid>
      ))
      )
    }


    useEffect(() => {
      const tokenList = getTokenMap()
      
    },[]);
        
      return (
        <div className="App">
          <header className="App-header">
          <Paper className={classes.layout}>
            <Typography variant="h6" gutterBottom>
              Choose A Donation
            </Typography>
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
  
