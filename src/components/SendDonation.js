import React, {useCallback, useEffect, useState, setState} from "react"
import {API} from 'aws-amplify'
import Typography from '@material-ui/core/Typography';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import './check.css'



export default function SendDonation(props){
    const [sent,setSent] = useState(null)
    console.log(props)
    async function send() {
        var newAmount = props.amount
        if (newAmount === "?"){
            newAmount = 0;
        }
        const snd = await API.post(
        'streamlabs',
        '/donate',
        {body:{
          name: props.name,
          message:props.message,
          walletAddress:props.address,
          amount:newAmount,
          currency:'USD',
          
        }})
        console.log(snd)
        setSent(snd.Donation)
       }

    useEffect(() => {
    
        send();
        
      }, [props.props]);

    return(
        <div>
            {sent !== null ? 
                sent === false ? 
                <div>
                    <Typography variant="h6" gutterBottom>
                    An Error Happened!
                    </Typography>
                    <ErrorOutlineIcon fontSize="large" style={{color: "red"}}/>
                    
                </div>
                :
                <div>
                <Typography variant="h6" gutterBottom>
                    Sent!
                </Typography>
                <div class="check"/>
                </div>
            
            :
            <CircularProgress />
            }
        </div>
    )
}