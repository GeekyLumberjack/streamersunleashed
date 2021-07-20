import React, { useState } from "react";
import { Container, Box, Button, ButtonBase } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";
import { tokenMapConfig } from './networkConfigs'
import CircularProgress from '@material-ui/core/CircularProgress';

const StyledButton = withStyles(() => ({
  root: {
    marginRight: "1rem",
    width: "25%",
    padding: "1rem",
    fontSize: "1.2rem",
    borderRadius: "1rem",
    color: "#000",
    fontWeight: "400",
    textTransform: "capitalize"
  }
}))(ButtonBase);

const styles = makeStyles(() => ({
  buttonContainerWrapper: {
    //display: "flex",
    justifyContent: "center"
  },
  buttonContainer: {
    border: "1px solid #4F5E65",
    padding: "1rem",
    //display: "flex",
    justifyContent: "space-between",
    borderRadius: "25px"
  },
  lastButtonFilter: {
    marginRight: "0rem"
  },
  activeButton: {
    background: "#3fb599",
    color: "#fff"
  }
}));



export default function ChooseDonationButtons(props) {
  const classes = styles();
  

  

  const clickedButtonHandler = (e) => {
    //console.log(e.target);
    const { name } = e.target;
    props.props.setActiveButton(name);
    //console.log(props.props.activeButton);
  };

  function getNetworkName(obj){
      const net = Object.entries(obj).find(net => net[0].slice(0,-1) === "network")[1]
      for(var i=0; i<tokenMapConfig.length; i++){
          if(Object.values(tokenMapConfig[i])[0] === net){
              return Object.keys(tokenMapConfig[i])[0]
          }
      }
      return "?"
  }

  function buttons(list){
    return(list.map((token, index) =>(
        <StyledButton
          key = {index.toString()}
          name={index.toString()}
          className={props.props.activeButton === index.toString() ? `${classes.activeButton}` : ""}
          onClick={clickedButtonHandler}
        >{Object.entries(token).find(net => net[0].slice(0,-1) === "action")[1]} {Object.entries(token).find(net => net[0] === "price")[1]} {getNetworkName(token)}</StyledButton>
        )
        )
    )
}


  return (
    <Container className={classes.buttonContainerWrapper}>
      <Box className={classes.buttonContainer}>
        {props.props.tokenMap.length > 0 ? buttons(props.props.tokenMap) : <CircularProgress />}
      </Box>
    </Container>
  );
}
