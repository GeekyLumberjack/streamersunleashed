import { createTheme } from "@material-ui/core"


export const theme = createTheme({
    palette:{
        primary:{
            main: '#c7f3ff'
        },
        secondary:{
            main: '#94e8ff'
        },
        error:{
            main: '#111111'
        }

    },
    overrides:{
        MuiButton: {
            containedPrimary:{
                color: "#2a2a2a"
            },
            containedSecondary:{
                color: "#2a2a2a"
            },

        }
    }
})