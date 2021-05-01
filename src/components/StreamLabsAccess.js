import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ClientOAuth2 from 'client-oauth2';
import {API} from 'aws-amplify'


var streamlabs = new ClientOAuth2({
  clientId: 'OTgPYBs7dsnSJN6yph3HlYDpjCyEx4q5lXyLskds',
  authorizationUri: 'https://streamlabs.com/api/v1.0/authorize',
  redirectUri: 'http://streamersunleashed.com' // required
  
});

var uri = streamlabs.code.getUri();


export default function AccessForm() {

useEffect(() => {
  async function onLoad() {
      try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if(urlParams.has('code')){
          API.post('streamlabs','/streamlabsAccess',{body:{code:urlParams.get("code")}})
        }  
      } catch (e) {
        alert(e.message); 
      }
    }
    onLoad();
  });


  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Authorize Access to Streamlabs
      </Typography>
      <Grid>
        <Typography variant="p" gutterBottom>
            This will take you to the streamlabs site to grant access
        </Typography>
      </Grid>
      <Grid spacing={2}>
        <Button variant="contained" color="primary" style={{ 'margin-top': 20 }} onClick={()=> window.location.href = uri}>Authorize</Button>
      </Grid>
    </React.Fragment>
  );
}
