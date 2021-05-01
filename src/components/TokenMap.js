import React, { useReducer, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { SportsBasketball } from '@material-ui/icons';

export default function TokenMapForm() {
    function reducer(state, action){
        switch(action.type){
            case "initialLoad":
                return{...state, ...action.action}
            case "addToken":
                var lLen = state.TokenList.length
                var addressName = "address"+ lLen.toString()
                var actionName = "action"+lLen.toString()
                var obj = {}
                obj[addressName] = ""
                obj[actionName] = ""
                console.log(state)
                return{...state,
                     TokenList:[
                         ...state.TokenList, 
                            obj
                        ]
                    }
            case "changeTokenValue":
                const cField = action.action.field;
                const cValue = action.action.value;
                var indexi, indexx;
                for(var i=0;i<state.TokenList.length;i++){
                    var keys = Object.keys(state.TokenList[i])
                    for(var x=0;x<keys.length;x++){
                        if(keys[x] == cField){                            
                            indexi = i;
                            indexx = x; 
                        }
                    }
                }
                var newTokenList = state.TokenList
                newTokenList[indexi][indexx] = cValue
                return {...state, TokenList: newTokenList}


        }
    }

    useEffect( () => {})

    const [state, dispatch] = useReducer(reducer, {TokenList:[{address0:"",action0:""}]});

    const addToken = (e) => dispatch({type:"addToken"})
    const fieldChange = (e) => dispatch({type: "changeTokenValue", action: {field: e.target.name, value:  e.target.value}})
    function RenderTokenList(TokenList){
        return( 
        <div>
            {TokenList.map((token) => (
            <Grid container spacing={3}>
                <Grid item xs={6} md={6}>
                <TextField
                    required
                    name = {Object.keys(token)[0]}
                    label="Lock Address"
                    fullWidth
                    onChange={fieldChange}
                />
                </Grid>
                <Grid item xs={6} md={6}>
                <TextField name={Object.keys(token)[1]} label="Action" onChange={fieldChange} fullWidth select>
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
        Payment method
      </Typography>
      
            {RenderTokenList(state.TokenList)}
        <Grid>
            <Button onClick={addToken} variant="contained" color="primary" style={{ 'margin-top': 20 }}>Add Token</Button>
        </Grid>
      
    </React.Fragment>
  );
}