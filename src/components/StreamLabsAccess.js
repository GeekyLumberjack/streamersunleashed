import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ClientOAuth2 from 'client-oauth2';
import {API} from 'aws-amplify'
import { BlackButton } from './BlackButton';
import "./check.css"


var streamlabs = new ClientOAuth2({
  clientId: 'OTgPYBs7dsnSJN6yph3HlYDpjCyEx4q5lXyLskds',
  authorizationUri: 'https://streamlabs.com/api/v1.0/authorize',
  redirectUri: 'https://streamersunleashed.com',
  scopes: ['donations.create','alerts.create']
  
});

var uri = streamlabs.code.getUri();


export default function AccessForm(props) {
const [hasCode, setHasCode] = React.useState(false);

useEffect(() => {
  async function onLoad() {
      try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if(props.props.code){
          setHasCode(true)
        }
        else{
          if(urlParams.has('code')){
            const code = await API.post('streamlabs','/streamlabsAccess',{body:{code:urlParams.get("code"),walletAddress:props.props.walletAddress}})
            //console.log(code)
            setHasCode(code.code)
          } 
          else{
            setHasCode(props.props.code)
          }
        }
      } catch (e) {
        console.log(e.message); 
      }
    }
    onLoad();
  });


  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Authorize Access to Streamlabs
      </Typography>
      {hasCode === false ? 
      <div>
      <Grid>
        <Typography variant="body1" gutterBottom>
            This will take you to the streamlabs site to grant access
        </Typography>
      </Grid>
      <Grid >
        <BlackButton variant="contained" style={{ marginTop: 20 }} onClick={()=> window.location.href = uri}>Authorize</BlackButton>
      </Grid>
      </div> :
       <div className="check"/> 
  }
    </React.Fragment>
  );
}
