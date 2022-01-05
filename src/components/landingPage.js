import React from "react";
import { Grid, ImageList, ImageListItem } from "@material-ui/core";
import landingImage from './landingPage1.png'
import AuthOwner from "./AuthOwner";

export default function landingPage(){




return(
    <Grid container align='center' direction='column' style={{marginTop: 100}}>
        <Grid item>
            <img src={landingImage} style={{maxHeight:'100%', maxWidth:'100%'}} />
        </Grid>
        <Grid item>
            <AuthOwner/>
        </Grid>

    </Grid>
    
)
}