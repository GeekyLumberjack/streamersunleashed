import React, { useReducer, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import API from '@aws-amplify/api';


export default function TokenMapForm(props) {
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
                        if(keys[x] === cField){                            
                            indexi = i;
                            indexx = x; 
                        }
                    }
                }
                var newTokenList = state.TokenList;
                newTokenList[indexi][cField] = cValue;
                return {...state, TokenList: newTokenList}
            
            case "saveTokenMap":
                
                return {...state, TokenList:action.action}

            default:
                return state


        }
    }

    useEffect( () => {})
    if(props.props.tokenMap){
        var TokenList = props.props.tokenMap;
    }
    else{
        var TokenList = [{address0:"",action0:""}];
    }
    
    const [state, dispatch] = useReducer(reducer, {TokenList});

    async function saveTokenMap(e){
        const results = await API.post("streamlabs","/tokenMap",{body: {walletAddress:props.props.walletAddress, tokenMap:e}})
        //dispatch({type:"saveTokenMap",action:results.Items})
    };

    

    const addToken = (e) => dispatch({type:"addToken"});
    
    const fieldChange = (e) => dispatch({type: "changeTokenValue", action: {field: e.target.name, value:  e.target.value}})
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
      
            {RenderTokenList(state.TokenList)}
        <Grid>
            <Button onClick={addToken} variant="contained" color="primary" style={{ 'margin-top': 20 }}>Add Token</Button>
            <Button onClick={() => saveTokenMap(state.TokenList)} variant="contained" color="primary" style={{ 'margin-left': 20, 'margin-top': 20 }}>Save Token Map</Button>
        </Grid>
      
    </React.Fragment>
  );
}