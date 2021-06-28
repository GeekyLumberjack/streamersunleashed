import React, { useEffect, useReducer, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import AccessForm from './StreamLabsAccess';
import TokenMapForm from './TokenMap';
import CustomizeUrl from './CustomizeUrl';
import {API} from 'aws-amplify'


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));



const steps = ['Authorize Streamlabs', 'Setup Token Actions', 'Finished!'];

function getStepContent(step, walletAddress, code, tokenMap, dispatch) {
  switch (step) {
    case 0:
      return <AccessForm props={{walletAddress:walletAddress, code:code}}/>;
    case 1:
      return <TokenMapForm props={{walletAddress: walletAddress, tokenMap: tokenMap, dispatch:dispatch}}/>;
    case 2:
      return <CustomizeUrl props={{walletAddress: walletAddress}} />;
    default:
      throw new Error('Unknown step');
  }
}

export default function Checkout(props) {
  const [code, setCode] = React.useState(false);
  const [tokenList, setTokenList] = React.useState();

  function reducer(state, action){
    switch(action.type){
        case "initialLoad":
            console.log(action)
            return{...state, ...action.action}
        case "addToken":
            console.log(state);
            var lLen = state.TokenList.length
            var addressName = "address"+ lLen.toString()
            var actionName = "action"+lLen.toString()
            var network = "network"+lLen.toString()
            var obj = {}
            obj[addressName] = ""
            obj[actionName] = ""
            obj[network] = ""
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


  async function saveTokenMap(e){
    const results = await API.post("streamlabs","/tokenMap",{body: {walletAddress:props.props, tokenMap:state.TokenList}})
    //dispatch({type:"saveTokenMap",action:results.Items})
  };

  const [state, dispatch] = useReducer(reducer, {});

  
  async function onLoad() {
    try {
      if(props){
        const response = await API.post('streamlabs','/profile',{body:{walletAddress: props.props}});
        setCode(response.code)
        if(response.hasCode.Item.tokenMap.length > 0){
            setTokenList(response.hasCode.Item.tokenMap);
            dispatch({type:'saveTokenMap',action:response.hasCode.Item.tokenMap});
        }
        else{
          setTokenList([{address0:"",action0:""}]);
          dispatch({type:'saveTokenMap',action:[{address0:"",action0:""}]});
        }
      }  
    } catch (e) {
      console.log(e.message); 
    }
  }
  
  useEffect(() => {
    
      onLoad();
      
    }, [props.props]);
  
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    if (activeStep === 1){
      saveTokenMap();
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Integrate Streamlabs with Unlock!
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
            
            <React.Fragment>
              {getStepContent(activeStep, props.props, code, state.TokenList, dispatch)}
              <div className={classes.buttons}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} className={classes.button}>
                    Back
                  </Button>
                )}
                {activeStep === steps.length - 1 ?
                <div/> :
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                Next
                </Button>
                }
              </div>
            </React.Fragment>
          
        </Paper>
        
      </main>
    </React.Fragment>
  );
}