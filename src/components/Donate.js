import React, {useCallback, useEffect, useState} from "react"
import Checkout from "./Checkout"
import { Check } from "@material-ui/icons";
import { Button, TextField } from '@material-ui/core';
import {API} from 'aws-amplify'

export default function Donate(){
   const [locked, setLocked] = useState('pending');
   const [address, setAddress] = useState('pending');
   const [name, setName] = useState();

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
   paywallConfig['locks']['0xE7575764442aD64F14a209753169617030915227'] = {
    name: "One time contribution!"
  }
   const changeNameField = (e) => {setName(e.target.value)}
   
   const send = async () => {API.post(
     'streamlabs',
     '/donate',
     {body:{
       name: name,
       walletAddress:address,
       amount:1,
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
    const donate = useCallback(e => {
        console.log(e)
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
      window.addEventListener("unlockProtocol", unlockHandler)

      return () => {window.removeEventListener("unlockProtocol", unlockHandler)
      if(existingScript){
        existingScript.remove();};
    }},[]);
        
      return (
        <div className="App">
          <header className="App-header">
          {locked === "locked"  && (
              <div onClick={donate} style={{ cursor: "pointer" }}>
                Unlock me!{" "}
                <span aria-label="locked" role="img">
                  🔒
                </span>
              </div>
            )}
            {locked === "unlocked" && address !== 'pending' && (
              <div>
                  <TextField name="name" label="Name to show" value={name} onChange={changeNameField} fullWidth/>
                  <Button variant="contained" color="primary" style={{ 'margin-top': 20 }} onClick={send}>Donate</Button>
              </div>
            )}
          </header>
        </div>
      )
    }
  
