import React, { useEffect, } from 'react';
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
      width: 600,
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

function getStepContent(step, walletAddress, code, tokenMap) {
  switch (step) {
    case 0:
      return <AccessForm props={{walletAddress:walletAddress, code:code}}/>;
    case 1:
      return <TokenMapForm props={{walletAddress: walletAddress, tokenMap: tokenMap}} />;
    case 2:
      return <CustomizeUrl props={{walletAddress: walletAddress}} />;
    default:
      throw new Error('Unknown step');
  }
}

export default function Checkout(props) {
  const [code, setCode] = React.useState(false);
  const [tokenMap, setTokenMap] = React.useState();
  async function onLoad() {
    try {
      if(props){
        const response = await API.post('streamlabs','/profile',{body:{walletAddress: props.props}});
        setCode(response.code)
        setTokenMap(response.hasCode.Item.tokenMap)
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
              {getStepContent(activeStep, props.props, code, tokenMap)}
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