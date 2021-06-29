import React, { useContext, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import API from '@aws-amplify/api';
import { tokenMapConfig } from './networkConfigs'


export default function TokenMapForm(props) {
    
    const addToken = (e) => props.props.dispatch({type:"addToken"});  
    const fieldChange = (e) => props.props.dispatch({type: "changeTokenValue", action: {field: e.target.name, value:  e.target.value}})
    function deleteToken (e){
      props.props.dispatch({type:"deleteToken", action:e})
    };
    useEffect( () => {})
    
    function RenderTokenList(TokenList){
        
        return( 
        <div>
            {TokenList.map((token) => (
            <Grid  container spacing={3}>
                <Grid  item xs={2} md={2}>
                  <TextField 
                    name={Object.entries(token).find(net => net[0].slice(0,-1) === "network")[0]} 
                    label="Network" 
                    value={Object.entries(token).find(net => net[0].slice(0,-1) === "network")[1]} 
                    onChange={fieldChange} 
                    fullWidth 
                    select
                  >
                    {tokenMapConfig.map((config) => (
                      <MenuItem value={Object.values(config)[0]}>{Object.keys(config)[0]}</MenuItem>
                    ))}
                    
                  </TextField>
                </Grid>
                <Grid  item xs={6} md={6}>
                <TextField
                    required
                    name = {Object.entries(token).find(net => net[0].slice(0,-1) === "address")[0]}
                    label="Lock Address"
                    value = {Object.entries(token).find(net => net[0].slice(0,-1) === "address")[1]}
                    fullWidth
                    onChange={fieldChange}
                />
                </Grid>
                <Grid  item xs={3} md={3}>
                <TextField 
                  name={Object.entries(token).find(net => net[0].slice(0,-1) === "action")[0]} 
                  label="Action" 
                  value={Object.entries(token).find(net => net[0].slice(0,-1) === "action")[1]} 
                  onChange={fieldChange} 
                  fullWidth 
                  select
                >
                <MenuItem value="donation">Donation</MenuItem>
                <MenuItem value="superchat">Superchat</MenuItem>
                </TextField>
                </Grid>
                <Grid  item xs={1} md={1} style={{marginTop:20, }}>
                      <ButtonBase onClick={() => deleteToken(Object.entries(token).find(net => net[0].slice(0,-1) === "action")[0])}>
                        <DeleteForeverIcon />
                      </ButtonBase>
                </Grid>
            </Grid>
            ))}
        </div>)
    }
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Configure Locks
      </Typography>
      
            {RenderTokenList(props.props.tokenMap)}
        <Grid>
            <Button onClick={addToken} variant="contained" color="primary" style={{ 'margin-top': 20 }}>Add Lock</Button>
            
        </Grid>
      
    </React.Fragment>
  );
}