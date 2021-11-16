import React from "react";
import { Grid, Typography } from "@material-ui/core";
import landingImage from './landingPage1.png'
import AuthOwner from "./AuthOwner";

export default function landingPage(){




return(
    <Grid container align='center' direction='column' style={{marginTop: 100}}>
        <Grid item>
            <img src={landingImage} style={{maxWidth:1500}} />
        </Grid>
        <Grid item>
            <AuthOwner/>
        </Grid>

    </Grid>
    
)
}