import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';



const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
}));

export default function CustomizeUrl(props) {
  const classes = useStyles();
  const [customUrl, setCustomUrl] = React.useState()

  useEffect(() => {
    async function onLoad() {
        try {
          
            //const response = await API.post('streamlabs','/profile',{body:{walletAddress: props}});
            const walletAddress = JSON.parse(props.props.walletAddress)
            setCustomUrl("https://streamersunleashed.com/"+walletAddress.address)
          
        } catch (e) {
          alert(e.message); 
        }
      }
      onLoad();
    });

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Your Custom URL 
      </Typography>
          <ListItem className={classes.listItem} key={'url'}>
            <ListItemText primary={customUrl} />
          </ListItem>
    </React.Fragment>
  );
}
