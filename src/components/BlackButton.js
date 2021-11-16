import { Button, withStyles } from "@material-ui/core"

export const BlackButton =withStyles(() => ({
    root: {
      color:'#fafeff',
      backgroundColor: "#111111",
    }
  }))(Button)