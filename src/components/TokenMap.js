import React, { useContext, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import API from '@aws-amplify/api';


export default function TokenMapForm(props) {
    console.log(props.props.dispatch)
    const addToken = (e) => props.props.dispatch({type:"addToken"});  
    const fieldChange = (e) => props.props.dispatch({type: "changeTokenValue", action: {field: e.target.name, value:  e.target.value}})
    useEffect( () => {})
    
    function RenderTokenList(TokenList){
        console.log(TokenList)
        return( 
        <div>
            {TokenList.map((token) => (
            <Grid container spacing={3}>
                <Grid item xs={6} md={6}>
                <TextField
                    required
                    name = {Object.keys(token)[1]}
                    label="Lock Address"
                    value = {Object.values(token)[1]}
                    fullWidth
                    onChange={fieldChange}
                />
                </Grid>
                <Grid item xs={6} md={6}>
                <TextField name={Object.keys(token)[0]} label="Action" value={Object.values(token)[0]} onChange={fieldChange} fullWidth select>
                <MenuItem value="donation">Donation</MenuItem>
                <MenuItem value="superchat">Superchat</MenuItem>
                </TextField>
                </Grid>
            </Grid>
            ))}
        </div>)
    }
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Token Map
      </Typography>
      
            {RenderTokenList(props.props.tokenMap)}
        <Grid>
            <Button onClick={addToken} variant="contained" color="primary" style={{ 'margin-top': 20 }}>Add Token</Button>
            
        </Grid>
      
    </React.Fragment>
  );
}